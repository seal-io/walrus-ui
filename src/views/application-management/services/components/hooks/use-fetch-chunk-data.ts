import { ref, onBeforeUnmount, inject } from 'vue';
import _ from 'lodash';
import {
  createAxiosToken,
  useSetChunkRequest
} from '@/api/axios-chunk-request';
import { websocketEventType } from '@/views/config';
import { ServiceResource } from '../../config/interface';
import {
  queryServiceResource,
  SERVICE_API_PREFIX,
  SERVICE_API
} from '../../api';

export default function useFetchResource() {
  const { setChunkRequest } = useSetChunkRequest();
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
    if (!children.length) return;
    if (children.length) {
      _.each(children, (data) => {
        data.isLeaf = true;
        data.isChilren = true;
        data.parentId = parent.id;
        data.key = parent.id;
        setChildDataProperties(data);
      });
    }
    parent.children = children;
  };

  const setDataList = (list) => {
    return _.each(list, (s) => {
      setChildDataProperties(s);
      // return s;
    });
  };

  const deleteChildResource = (childId, list: ServiceResource[]) => {
    if (!list || !list.length) return;
    _.each(list, (sItem) => {
      const deleteIndex = _.findIndex(
        sItem.components || [],
        (item) => item.id === childId
      );
      if (deleteIndex > -1) {
        sItem.components.splice(deleteIndex, 1);
      } else {
        deleteChildResource(childId, sItem.components || []);
      }
    });
  };

  const createChildResource = (child, list: ServiceResource[]) => {
    if (!list || !list.length) return;
    _.each(list, (pItem) => {
      if (child?.composition?.id === pItem.id) {
        pItem.components = _.concat(_.cloneDeep(child), pItem.components || []);
      } else {
        createChildResource(child, pItem.components || []);
      }
    });
  };

  const updateResource = (child, list: ServiceResource[]) => {
    if (!list || !list.length) return;
    _.each(list, (pItem) => {
      if (child.composition.id === pItem.id) {
        const updateIndex = _.findIndex(
          pItem.components,
          (cItem) => cItem.id === child.id
        );
        if (updateIndex > -1) {
          const updateItem = _.cloneDeep(child);
          pItem.components[updateIndex] = updateItem;
        } else {
          pItem.components = _.concat(_.cloneDeep(child), pItem.components);
        }
      } else {
        updateResource(child, pItem.components || []);
      }
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
    if (data?.type === websocketEventType.DELETE) {
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
        deleteChildResource(childId, dataList.value);
      });
      dataList.value = setDataList(dataList.value);
      return;
    }

    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      // parent resource
      dataList.value = _.concat(_.cloneDeep(parentResources), dataList.value);
      dataList.value = _.uniqBy(dataList.value, 'id');
      // sub resource
      _.each(childResources, (item) => {
        createChildResource(item, dataList.value);
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
      updateResource(item, dataList.value);
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
      const { data } = await queryServiceResource(params, fetchToken.token);

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
  // get helm resource ids
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
        const { data } = await queryServiceResource(params, fetchToken.token);
        let list: any = _.filter(
          data?.items || [],
          (item) => item?.service?.id === serviceId.value
        );
        list = setDataList(list);
        dataList.value = [].concat(list);
      } catch (error) {
        //
      }
    }
  };
  const updateCallback = (list: object[]) => {
    helmResourceNeedUpdate.clear();
    _.each(list, (data) => {
      updateDataList(data);
    });
    getHelmResourceIDs();
  };
  const createResourceChunkRequest = () => {
    requestCacheList.value = [];
    try {
      setChunkRequest({
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}/${
          serviceId.value
        }/resources`,
        handler: updateCallback,
        beforeReconnect: fetchData
      });
    } catch (error) {
      //
    }
  };
  onBeforeUnmount(() => {
    fetchToken?.cancel?.();
  });
  return {
    fetchData,
    createResourceChunkRequest,
    loading,
    dataList
  };
}
