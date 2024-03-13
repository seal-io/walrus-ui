import mitt, { Handler } from 'mitt';

const emitter = mitt();

const key = Symbol('FILTER_CATALOG_LIST_KEY');

const key2 = Symbol('FILTER_TEMPLATE_LIST_KEY');

// trigger the event
export function emitFilterCatalogAction(data: any) {
  emitter.emit(key, data);
}

export function listenFilterCatalogAction(handler: (data) => void) {
  emitter.on(key, handler as Handler);
}

export function removeFilterCatalogActionListener() {
  emitter.off(key);
}

// filter template
export function emitFilterTemplateAction(data: any) {
  emitter.emit(key2, data);
}

export function listenFilterTemplateAction(handler: (data) => void) {
  emitter.on(key2, handler as Handler);
}

export function removeFilterTemplateActionListener() {
  emitter.off(key2);
}

export default {};
