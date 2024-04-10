import { onBeforeUnmount } from 'vue';
import qs from 'query-string';

export const createEventSourceURL = (url) => {
  const { host, protocol } = window.location;
  return `${protocol}://${host}${url}`;
};

/*  
0: connecting
1: connect successfully
2: closed
*/

export default function useEventSource() {
  let SSE: any = null;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const createEventSourceConnection = ({ url, params, onmessage }) => {
    SSE?.close?.();

    SSE = new EventSource(
      `${BASE_URL}${url}?${qs.stringify({
        ...params,
        watch: true
      })}`,
      {
        withCredentials: true
      }
    );

    SSE.onmessage = (res) => {
      try {
        const data = JSON.parse(res.data);
        console.log('event source message: ', { data });
        onmessage(data);
      } catch (error) {
        // error
      }
    };

    SSE.onopen = () => {
      console.log('event source connected...');
    };

    SSE.onerror = (error) => {};
  };

  onBeforeUnmount(() => {
    SSE?.close?.();
  });

  return {
    SSE,
    createEventSourceConnection
  };
}
