import mitt, { Handler } from 'mitt';

const emitter = mitt();

const key = Symbol('UPDATE_APPLICATION');

export function updateApplicationEmitter() {
  emitter.emit(key);
}

export function listenerUpdateAppAction(handler: () => void) {
  emitter.on(key, handler as Handler);
}

export function removeUpdateAppActionListener() {
  emitter.off(key);
}

export default {};
