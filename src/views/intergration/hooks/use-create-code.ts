import qs from 'query-string';
import { onUnmounted } from 'vue';

export default function useCreateCode() {
  const formatValue = (list: string[]) => {
    const len = list.length;
    const last = list[len - 1];
    if (last === '') {
      list.pop();
      formatValue(list);
    } else {
      return list.join('/');
    }
    return list.join('/');
  };
  const storeageHandler = (params, handler?): void => {
    let query: any = localStorage.getItem('code') || {};
    query = qs.parse(query);
    console.log('queryCode===', query);
    if (query?.code && query?.state === String(params.state)) {
      localStorage.removeItem('code');
      handler(query);
    }
  };
  const handleStorageEvent = (params, handler) => {
    window.addEventListener('storage', (e) => {
      storeageHandler(params.query, handler);
    });
  };
  const openUrl = (url) => {
    window.open(
      url,
      '_blank',
      'fullscreen=no,scrollbars=yes,left=300,top=0,toolbar=no,height=800, width=700'
    );
  };
  onUnmounted(() => {
    window.removeEventListener('storage', storeageHandler);
  });
  return {
    handleStorageEvent,
    openUrl,
    formatValue,
  };
}
