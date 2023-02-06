import { onBeforeUnmount, onUnmounted } from 'vue';

const localServer = window.location.host;
const protocal = import.meta.env.MODE === 'development' ? 'wss' : 'wss';

export const wssResourceList = `${protocal}://${localServer}/v1/resources`;

export const wssEventList = `${protocal}://${localServer}/v1/events`;

export function useWebsocket({ url, onmessage }) {
  // ws.readyState
  // CONNECTING: 0
  // OPEN ：1 connect successfully
  // CLOSING ：2 in closing...
  // CLOSED ：3 closed

  // update time
  let timer: any = null;
  let connectTimer: any = null;
  let wss = new WebSocket(url);
  let isneedReconnect = true;

  // listen the connect status: readyState
  wss.onopen = () => {
    console.log('wss connected successfully...');
  };
  const reConnect = () => {
    connectTimer = setInterval(() => {
      if (wss.readyState === 3) {
        console.log('wss re-connecting...', wss.readyState);
        wss = new WebSocket(url);
      } else {
        console.log('wss stop re-connecting...', wss.readyState);
        clearInterval(connectTimer);
      }
    }, 1000 * 5);
  };
  // error
  wss.onerror = () => {
    console.log('wss error...');
    wss = new WebSocket(url);
  };

  // receive message from server
  wss.onmessage = (res) => {
    const data = JSON.parse(res.data);
    console.log('wss message:', { res, data });
    onmessage(data);
  };
  wss.onclose = () => {
    console.log('wss connect closed...');
    if (isneedReconnect) {
      reConnect();
    }
  };
  const wssClose = () => {
    console.log('wss closed...');
    wss.close();
  };
  const wssSend = (data) => {
    wss.send(data);
  };
  const updateEvaluateTime = (callback) => {
    timer = setInterval(() => {
      callback?.();
    }, 60 * 1000);
  };

  window.addEventListener('offline', () => {
    reConnect();
  });
  onBeforeUnmount(() => {
    isneedReconnect = false;
  });
  onUnmounted(() => {
    wssClose();
    clearInterval(timer);
    clearInterval(connectTimer);
    window.removeEventListener('offline', () => {
      reConnect();
    });
  });
  return {
    wss,
    wssClose,
    wssSend,
    updateEvaluateTime,
  };
}

export default {};
