import { ref, onBeforeUnmount, inject } from 'vue';
import _ from 'lodash';
import {
  createAxiosToken,
  useSetChunkRequest
} from '@/api/axios-chunk-request';
import usePermissionParams from '@/views/application-management/hooks/use-permission-params';
import { ServiceResource } from '../../config/interface';
import { websocketEventType } from '../../config';
import { queryApplicationResource } from '../../api';
import { updateResourceEmitter } from '../../hooks/update-resource-listener';

export default function useFetchResource() {
  const { setChunkRequest } = useSetChunkRequest();
  const permissionParams = usePermissionParams();
  const dataList = ref<ServiceResource[]>([]);
  const loading = ref(false);
  const serviceId = inject('serviceId', ref(''));
  const requestCacheList = ref<number[]>([]);
  const helmResourceNeedUpdate = new Set();
  let fetchToken = createAxiosToken();

  const setParentDataProperties = (data) => {
    data.isLeaf = !data.components?.length;
    data.isParent = true;
    data.key = data.id;
  };
  const setChildDataProperties = (parent) => {
    setParentDataProperties(parent);
    const children = parent.components || [];
    if (children.length) {
      _.each(children, (data) => {
        data.isLeaf = true;
        data.isChilren = true;
        data.parentId = parent.id;
        data.key = parent.id;
      });
    }
    parent.children = children;
  };

  const setDataList = (list) => {
    return _.map(list, (s) => {
      setChildDataProperties(s);
      return s;
    });
  };
  const updateDataList = (data) => {
    const collections = _.filter(
      data.collection || [],
      (sItem) => sItem?.service?.id === serviceId.value
    );

    const childResources = _.filter(collections, (item) =>
      _.get(item, 'composition.id')
    );

    // TODO
    if (childResources.length) {
      _.each(childResources, (item) => {
        helmResourceNeedUpdate.add(_.get(item, 'composition.id'));
      });
    }
    const parentResources = _.filter(
      collections,
      (item) => !_.get(item, 'composition.id')
    );

    // use it only delete action
    let ids = data?.ids || [];

    // DELETE
    if (data?.type === websocketEventType.delete) {
      // delete parent resource
      ids = _.filter(ids, (childId) => {
        const updateIndex = _.findIndex(
          dataList.value,
          (sItem) => sItem.id === childId
        );
        if (updateIndex > -1) {
          dataList.value.splice(updateIndex, 1);
        }
        return updateIndex === -1;
      });

      //  delete sub resource
      _.each(ids, (childId) => {
        _.each(dataList.value, (sItem) => {
          const deleteIndex = _.findIndex(
            sItem.components || [],
            (item) => item.id === childId
          );
          if (deleteIndex > -1) {
            sItem.components.splice(deleteIndex, 1);
          }
        });
      });
      dataList.value = setDataList(dataList.value);
      return;
    }

    // CREATE
    if (data?.type === websocketEventType.create) {
      // parent resource
      dataList.value = _.concat(_.cloneDeep(parentResources), dataList.value);
      dataList.value = _.uniqBy(dataList.value, 'id');
      // sub resource
      _.each(childResources, (item) => {
        _.each(dataList.value, (pItem) => {
          if (item?.composition?.id === pItem.id) {
            pItem.components = _.concat(
              _.cloneDeep(item),
              pItem.components || []
            );
          }
        });
      });
      dataList.value = setDataList(dataList.value);
      return;
    }

    // UPDATE
    _.each(parentResources, (item) => {
      const updateIndex = _.findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      } else {
        dataList.value = _.concat(_.cloneDeep(item), dataList.value);
      }
    });

    _.each(childResources, (item) => {
      _.each(dataList.value, (pItem) => {
        if (item.composition.id === pItem.id) {
          const updateIndex = _.findIndex(
            pItem.components,
            (cItem) => cItem.id === item.id
          );
          if (updateIndex > -1) {
            const updateItem = _.cloneDeep(item);
            pItem.components[updateIndex] = updateItem;
          } else {
            pItem.components = _.concat(_.cloneDeep(item), pItem.components);
          }
        }
      });
    });
    dataList.value = setDataList(dataList.value);
  };
  const fetchData = async () => {
    if (!serviceId.value) return;
    fetchToken?.cancel?.();
    fetchToken = createAxiosToken();
    try {
      loading.value = true;
      requestCacheList.value.push(1);
      const params = {
        page: -1,
        serviceID: serviceId.value
      };
      const { data } = await queryApplicationResource(params, fetchToken.token);

      let list: any = _.filter(
        data.items || [],
        (item) => item?.service?.id === serviceId.value
      );
      list = setDataList(list);
      dataList.value = [].concat(list);
      loading.value = false;
      requestCacheList.value.pop();
    } catch (error) {
      requestCacheList.value.pop();
      dataList.value = [];
      loading.value = !!requestCacheList.value.length;
    }
  };
  // TODO get helm resource ids
  const getHelmResourceIDs = async () => {
    if (!helmResourceNeedUpdate.size) return;
    const ids = [...helmResourceNeedUpdate];
    const resultList = _.filter(dataList.value, (item) => {
      return _.includes(ids, item.id) && item.type === 'helm_release';
    });
    if (resultList.length) {
      try {
        fetchToken?.cancel?.();
        fetchToken = createAxiosToken();
        const params = {
          page: -1,
          serviceID: serviceId.value
        };
        const { data } = await queryApplicationResource(
          params,
          fetchToken.token
        );
        let list: any = _.filter(
          data?.items || [],
          (item) => item?.instance?.id === serviceId.value
        );
        list = setDataList(list);
        dataList.value = [].concat(list);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const updateCallback = (list: object[]) => {
    helmResourceNeedUpdate.clear();
    _.each(list, (data) => {
      updateDataList(data);
    });
    // TODO
    getHelmResourceIDs();
  };
  const createResourceChunkConnection = () => {
    requestCacheList.value = [];
    try {
      setChunkRequest({
        url: `/service-resources`,
        params: {
          serviceID: serviceId.value,
          ...permissionParams
        },
        handler: updateCallback,
        beforeReconnect: fetchData
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  onBeforeUnmount(() => {
    console.log('wss unmounted 11');
    fetchToken?.cancel?.();
  });
  return {
    fetchData,
    createResourceChunkConnection,
    loading,
    dataList
  };
}
