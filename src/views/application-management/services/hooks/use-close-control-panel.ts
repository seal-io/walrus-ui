import mitt, { Handler } from 'mitt';

const emitter = mitt();

const key = Symbol('CLOSE_CONTROL_PANEL');

export function emitCloseControlPanel() {
  emitter.emit(key);
}

export function listenerCloseControlPanel(handler: () => void) {
  emitter.on(key, handler as Handler);
}

export function removeCloseControlPanelListener() {
  emitter.off(key);
}

export default {};
