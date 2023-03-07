import { ref } from 'vue';
import { keys, get, map } from 'lodash';

export default function useLabelsActions(formData) {
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
  getLabelList();
  return {
    labelList,
    handleAddLabel,
    handleDeleteLabel
  };
}
