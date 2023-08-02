const symbol = 'broadcast-channel';

const BC = new BroadcastChannel(symbol);

export default {
  postMessage: (message: any) => {
    BC.postMessage(message);
  },
  onmessage: (handler: (message: any) => void) => {
    BC.onmessage = (event) => {
      handler(event.data);
    };
  }
};
