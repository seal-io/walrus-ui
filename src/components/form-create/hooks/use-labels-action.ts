import { ref, isRef } from 'vue';
import _, { keys, map } from 'lodash';

export default function useLabelsActions(formData) {
  const get = (obj, key) => {
    return isRef(obj) ? _.get(obj.value, key) : _.get(obj, key);
  };
  const validateTrigger = ref(false);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const getLabelList = () => {
    labelList.value = [];
    const labelKeys = keys(get(formData, 'labels'));
    labelList.value = map(labelKeys, (k) => {
      return {
        key: k,
        value: get(formData, `labels.${k}`)
      };
    });
    if (!labelList.value.length) {
      labelList.value = [{ key: '', value: '' }];
    }
  };
  const validateLabel = () => {
    validateTrigger.value = _.some(
      labelList.value,
      (item) => !item.value && item.key
    );
  };
  getLabelList();
  return {
    labelList,
    validateTrigger,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList
  };
}
