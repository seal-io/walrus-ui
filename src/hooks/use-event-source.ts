export const createEventSourceURL = (url) => {
  const { host, protocol } = window.location;
  return `${protocol}://${host}${url}`;
};

export default function createEventSourceConnection({ url, onmessage }) {
  /*  
  0: connecting
  1: connect successfully
  2: closed
 */

  let connectTimer: any = null;
  let source: any = new EventSource(url, { withCredentials: true });
  const isneedReconnect = true;
  let tryCount = 3;
  const TRY_FREQ = 1000;

  source.onopen = () => {
    console.log('event source connected...');
  };
  const reConnect = () => {
    tryCount = 3;
    connectTimer = setInterval(() => {
      if (source.readyState === 3 && tryCount > 0) {
        tryCount -= 1;
        source = new EventSource(url, { withCredentials: true });
      } else {
        clearInterval(connectTimer);
      }
    }, TRY_FREQ);
  };

  source.onerror = (error) => {};

  source.onmessage = (res) => {
    try {
      const data = JSON.parse(res.data);
      console.log('event source message: ', { data });
      onmessage(data);
    } catch (error) {
      //
    }
  };

  source.onclose = () => {
    source?.close?.();
    if (isneedReconnect) {
      // reConnect();
    }
  };

  const close = () => {
    source.close();
  };

  const send = (data) => {
    source.send(data);
  };

  window.addEventListener('offline', () => {
    // reConnect();
  });

  return {
    source,
    close,
    send
  };
}
