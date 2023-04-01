import _ from 'lodash';
import { ref, onBeforeUnmount, Ref } from 'vue';
import { createWebsocketInstance } from '@/hooks/use-websocket';
import { websocketEventType } from '../config';

export default function useWebsocketUpdateList({
  list,
  url
}: {
  list: Ref<any[]>;
  url: string;
}) {
  const websocketRevisions = ref<any>(null);
  const updateList = (data) => {
    if (data?.type !== websocketEventType.update) return;
    const collections = data.collection || [];
    _.each(collections, (item) => {
      const updateIndex = _.findIndex(
        list.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(collections[updateIndex]);
        list.value[updateIndex] = updateItem;
      }
    });
  };
  const createInstanceListWebsocket = () => {
    try {
      websocketRevisions.value?.close?.();
      websocketRevisions.value = createWebsocketInstance({
        url,
        onmessage: updateList
      });
    } catch (error) {
      console.log(error);
    }
  };
  onBeforeUnmount(() => {
    websocketRevisions.value?.close?.();
  });
  return {
    createInstanceListWebsocket
  };
}
