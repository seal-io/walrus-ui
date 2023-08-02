import mitt, { Handler } from 'mitt';

const emitter = mitt();

const key = Symbol('UPDATE_STORE_PROJECTLIST');

export function updateStoreProjectListEmitter(data) {
  emitter.emit(key, data);
}

export function listenerStoreUpdateProjectList(handler: (data) => void) {
  emitter.on(key, handler as Handler);
}

export function removeUpdateStoreProjectListener() {
  emitter.off(key);
}

export default {};
