import { ref, ComponentPublicInstance } from 'vue';

export default function useDynamicRef() {
  type refItem = Element | ComponentPublicInstance | null;
  const refMap = ref<Record<string, refItem>>({});

  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };
  return {
    refMap,
    setRefMap
  };
}
