import { onBeforeUnmount } from 'vue';

export const createEventSourceURL = (url) => {
  const { host, protocol } = window.location;
  return `${protocol}://${host}${url}`;
};

/*  
0: connecting
1: connect successfully
2: closed
*/

export default function useEventSource({ url }) {
  let SSE: any = null;

  const createEventSourceConnection = ({ url, onmessage }) => {
    SSE?.close?.();

    SSE = new EventSource(url, { withCredentials: true });

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
