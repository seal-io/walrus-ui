import { Ref, toRaw } from 'vue';
import _ from 'lodash';
import { websocketEventType } from '../../config';

interface ChunkedCollection {
  ids: string[];
  collection: any[];
  type: string;
}
// Only used to update lists without nested state
export function useUpdateChunkedList(
  dataList: Ref<{ metadata: { name: string; namespace: string } }[]>,
  options?: {
    callback?: (args: any) => void;
    filterFun?: (args: any) => boolean;
    mapFun?: (args: any) => any;
    computedID?: (d: object) => string;
  }
) {
  const updateChunkedList = (data: ChunkedCollection) => {
    let collections = data?.collection || [];
    if (options?.computedID) {
      collections = _.map(collections, (item) => {
        item.id = options?.computedID?.(item);
        return item;
      });
    }
    if (options?.filterFun) {
      collections = _.filter(data?.collection, options?.filterFun);
    }
    if (options?.mapFun) {
      collections = _.map(data?.collection, options?.mapFun);
    }
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      _.each(collections, (item) => {
        const updateIndex = _.findIndex(
          dataList.value,
          (sItem) =>
            `${sItem.metadata?.namespace}/${sItem.metadata.name}` ===
            `${item.metadata.namespace}/${item.metadata.name}`
        );
        if (updateIndex === -1) {
          const updateItem = _.cloneDeep(item);
          dataList.value = _.concat(updateItem, toRaw(dataList.value));
        }
      });
    }
    // DELETE
    if (data?.type === websocketEventType.DELETE) {
      dataList.value = _.filter(dataList.value, (item) => {
        return !_.find(ids, (id) => id === item.id);
      });
    }
    // UPDATE
    if (data?.type === websocketEventType.UPDATE) {
      _.each(collections, (item) => {
        const updateIndex = _.findIndex(
          dataList.value,
          (sItem) => sItem.id === item.id
        );
        if (updateIndex > -1) {
          const updateItem = _.cloneDeep(item);
          dataList.value[updateIndex] = toRaw(updateItem);
        }
      });
    }
    if (options?.callback) {
      options?.callback(dataList.value);
    }
  };
  return {
    updateChunkedList
  };
}

export default {};
