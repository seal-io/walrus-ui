import HotKeys from '@/views/config/hot-keys';
import hotkeys from 'hotkeys-js';
import _ from 'lodash';
import { onBeforeUnmount, onMounted } from 'vue';

// export HotKeys
export { HotKeys };

export default function useHotKeys(handlerConfigList) {
  const bindHotKeys = () => {
    _.each(handlerConfigList, (handlerConfig) => {
      const { key, callback, options } = handlerConfig;
      hotkeys(_.join(key, ','), { ...options }, (event, handler) => {
        event.preventDefault();
        console.log('hotkey=========', handler.key, handler);
        callback();
      });
    });
  };

  const unbindHotKeys = () => {
    hotkeys.unbind();
  };

  onMounted(() => {
    bindHotKeys();
  });

  onBeforeUnmount(() => {
    unbindHotKeys();
  });

  return {
    bindHotKeys,
    unbindHotKeys
  };
}
