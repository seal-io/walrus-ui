import mitt, { Handler } from 'mitt';

const emitter = mitt();

const key = Symbol('UPDATE_RESOURCES');

export function updateResourceEmitter() {
  emitter.emit(key);
}

export function listenerUpdateResource(handler: () => void) {
  emitter.on(key, handler as Handler);
}

export function removeUpdateResourceListener() {
  emitter.off(key);
}

export default {};
