import { Ref } from 'vue';
import _ from 'lodash';
import { websocketEventType } from '../../config';

interface ChunkedCollection {
  ids: string[];
  collection: any[];
  type: string;
}
// Only used to update lists without nested state
export function useUpdateChunkedList(
  dataList: Ref<{ id: string }[]>,
  options?: {
    callback?: (args: any) => void;
    filterFun?: (args: any) => boolean;
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
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      dataList.value = _.concat(collections, dataList.value);
      return;
    }
    // DELETE
    if (data?.type === websocketEventType.DELETE) {
      dataList.value = _.filter(dataList.value, (item) => {
        return !_.find(ids, (id) => id === item.id);
      });
      return;
    }
    // UPDATE
    _.each(collections, (item) => {
      const updateIndex = _.findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      }
    });
    if (options?.callback) {
      options?.callback(dataList.value);
    }
  };
  return {
    updateChunkedList
  };
}

export default {};
