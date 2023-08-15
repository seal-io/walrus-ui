const symbol = 'broadcast-channel';

// safari does support BroadcastChannel on 15.4
const BC = window.BroadcastChannel
  ? new BroadcastChannel(symbol)
  : {
      postMessage: () => {},
      onmessage: () => {}
    };

export default {
  postMessage: (message: any) => {
    BC?.postMessage(message);
  },
  onmessage: (handler: (message: any) => void) => {
    BC.onmessage = (event) => {
      handler(event.data);
    };
  }
};
