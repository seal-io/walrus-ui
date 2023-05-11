import { ref, onBeforeUnmount, inject } from 'vue';
import _ from 'lodash';
import {
  createAxiosToken,
  useSetChunkRequest
} from '@/api/axios-chunk-request';
import { InstanceResource } from '../../config/interface';
import { websocketEventType } from '../../config';
import { queryApplicationResource } from '../../api';

export default function useFetchResource() {
  const { setChunkRequest } = useSetChunkRequest();
  const dataList = ref<InstanceResource[]>([]);
  const loading = ref(false);
  const instanceId = inject('instanceId', ref(''));
  const requestCacheList = ref<number[]>([]);
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
      (sItem) => sItem?.instance?.id === instanceId.value
    );
    // const collections = data?.collection || [];
    const childResources = _.filter(collections, (item) =>
      _.get(item, 'composition.id')
    );
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
    if (!instanceId.value) return;
    fetchToken?.cancel?.();
    fetchToken = createAxiosToken();
    try {
      loading.value = true;
      requestCacheList.value.push(1);
      const params = {
        page: -1,
        instanceID: instanceId.value
      };
      const { data } = await queryApplicationResource(params, fetchToken.token);
      let list: any = _.filter(
        data?.items || [],
        (item) => item?.instance?.id === instanceId.value
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
  const updateCallback = (list: object[]) => {
    _.each(list, (data) => {
      updateDataList(data);
    });
  };
  const createResourceChunkConnection = () => {
    try {
      setChunkRequest({
        url: `/application-resources`,
        params: {
          instanceID: instanceId.value
        },
        handler: updateCallback
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
