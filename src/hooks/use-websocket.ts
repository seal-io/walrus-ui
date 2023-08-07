const { host, protocol } = window.location;
const proto = protocol === 'https:' ? 'wss' : 'ws';

export const createWebSocketUrl = (url) => {
  return `${proto}://${host}/v1${url}`;
};
export function createWebsocketInstance({ url, onmessage }) {
  // ws.readyState
  // CONNECTING: 0
  // OPEN ：1 connect successfully
  // CLOSING ：2 in closing...
  // CLOSED ：3 closed

  const wss_url = createWebSocketUrl(url);
  let connectTimer: any = null;
  let wss = new WebSocket(wss_url);
  const isneedReconnect = true;
  let tryCount = 3;
  const TRY_FREQ = 1000;

  // listen the connect status: readyState
  wss.onopen = () => {};
  const reConnect = () => {
    tryCount = 3;
    connectTimer = setInterval(() => {
      if (wss.readyState === 3 && tryCount > 0) {
        tryCount -= 1;
        wss = new WebSocket(url);
      } else {
        clearInterval(connectTimer);
      }
    }, TRY_FREQ);
  };
  // error
  wss.onerror = (error) => {};

  // receive message from server
  wss.onmessage = (res) => {
    try {
      const data = JSON.parse(res.data);
      onmessage(data);
    } catch (error) {
      //
    }
  };
  wss.onclose = () => {
    wss?.close?.();
    if (isneedReconnect) {
      // reConnect();
    }
  };
  const close = () => {
    wss.close();
  };
  const send = (data) => {
    wss.send(data);
  };

  window.addEventListener('offline', () => {
    // reConnect();
  });

  return {
    wss,
    close,
    send
  };
}

export default {};
