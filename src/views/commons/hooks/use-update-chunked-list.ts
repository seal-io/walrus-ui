import { Ref } from 'vue';
import _ from 'lodash';
import { websocketEventType } from '../../config';

interface ChunkedCollection {
  ids: string[];
  collection: any[];
  type: number;
}
// Only used to update lists without nested state
export function useUpdateChunkedList(
  dataList: Ref<{ id: string }[]>,
  filterFun?: (args: any) => boolean
) {
  const updateChunkedList = (data: ChunkedCollection) => {
    let collections = data?.collection || [];
    if (filterFun) {
      collections = _.filter(data?.collection, filterFun);
    }
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.create) {
      dataList.value = _.concat(collections, dataList.value);
      return;
    }
    // DELETE
    if (data?.type === websocketEventType.delete) {
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
      } else {
        dataList.value = _.concat(_.cloneDeep(item), dataList.value);
      }
    });
  };
  return {
    updateChunkedList
  };
}

export default {};
