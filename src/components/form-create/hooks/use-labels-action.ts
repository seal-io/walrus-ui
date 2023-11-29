import { ref, isRef, onBeforeUnmount } from 'vue';
import _, { keys, map } from 'lodash';

export default function useLabelsActions(formData, key?: string | string[]) {
  const get = (obj, key) => {
    return isRef(obj) ? _.get(obj.value, key) : _.get(obj, key);
  };
  const validateTrigger = ref(false);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const labelItem = { key: '', value: '' };
  const labelsKey = key || 'labels';

  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const getLabelList = () => {
    labelList.value = [];
    const labelKeys = keys(get(formData, labelsKey));
    labelList.value = map(labelKeys, (k) => {
      let fieldKey = [labelsKey, k];
      if (_.isArray(labelsKey)) {
        fieldKey = [...labelsKey, k];
      }
      return {
        key: k,
        value: get(formData, fieldKey)
      };
    });
  };
  const validateLabel = () => {
    if (!labelList.value.length) {
      validateTrigger.value = false;
      return;
    }
    validateTrigger.value = _.some(labelList.value, (item) => !item.key);
  };
  const resetStatus = () => {
    validateTrigger.value = false;
  };
  getLabelList();

  return {
    labelList,
    validateTrigger,
    labelItem,
    resetStatus,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList
  };
}
