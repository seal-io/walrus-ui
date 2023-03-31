import { onBeforeUnmount, onUnmounted } from 'vue';

const localServer = window.location.host;
const protocal = import.meta.env.MODE === 'development' ? 'wss' : 'wss';

export const createWebSocketUrl = (url) => {
  return `wss://${localServer}/v1/${url}`;
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
  let isneedReconnect = true;
  let tryCount = 3;
  const TRY_FREQ = 1000;

  // listen the connect status: readyState
  wss.onopen = () => {
    console.log('wss connected successfully...');
  };
  const reConnect = () => {
    tryCount = 3;
    connectTimer = setInterval(() => {
      if (wss.readyState === 3 || tryCount > 0) {
        tryCount -= 1;
        console.log('wss re-connecting...', wss.readyState);
        wss = new WebSocket(url);
      } else {
        console.log('wss stop re-connecting...', wss.readyState);
        clearInterval(connectTimer);
      }
    }, TRY_FREQ);
  };
  // error
  wss.onerror = () => {
    console.log('wss error...');
    wss = new WebSocket(url);
  };

  // receive message from server
  wss.onmessage = (res) => {
    // const data = JSON.parse(res.data);
    console.log('wss message:', { res });
    onmessage(res);
  };
  wss.onclose = () => {
    console.log('wss closed...');
    if (isneedReconnect) {
      reConnect();
    }
  };
  const close = () => {
    wss.close();
  };
  const send = (data) => {
    wss.send(data);
  };

  window.addEventListener('offline', () => {
    reConnect();
  });
  onBeforeUnmount(() => {
    isneedReconnect = false;
  });
  onUnmounted(() => {
    close();
    window.removeEventListener('offline', () => {
      reConnect();
    });
  });
  return {
    wss,
    close,
    send
  };
}

export default {};
