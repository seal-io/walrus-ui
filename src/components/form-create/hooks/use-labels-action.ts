import { ref, isRef, onBeforeUnmount } from 'vue';
import _, { keys, map } from 'lodash';

export default function useLabelsActions(formData, key?: string | string[]) {
  const get = (obj, key) => {
    return isRef(obj) ? _.get(obj.value, key) : _.get(obj, key);
  };
  const validateTrigger = ref(false);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const labelItem = { key: ``, value: '' };
  const labelsKey = key || 'labels';
  const dataObj = ref({});

  const handleAddLabel = (obj, list?) => {
    if (list) {
      list.push({ ...obj });
    } else {
      labelList.value.push({ ...obj });
    }
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const getDataObj = () => {
    dataObj.value = _.reduce(
      labelList.value,
      (result, item) => {
        if (item.key) {
          result[item.key] = item.value;
        }
        return result;
      },
      {}
    );
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
  const setLabelList = (labels) => {
    labelList.value = [];
    const labelKeys = keys(labels);
    labelList.value = map(labelKeys, (k) => {
      return {
        key: k,
        value: get(labels, k)
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

  const clearList = () => {
    labelList.value = [];
  };

  return {
    labelList,
    validateTrigger,
    labelItem,
    dataObj,
    getDataObj,
    resetStatus,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList,
    clearList,
    setLabelList
  };
}

export function useMapString() {
  const get = (obj, key) => {
    return isRef(obj) ? _.get(obj.value, key) : _.get(obj, key);
  };
  const validateTrigger = ref(false);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const labelItem = { key: `key${labelList.value.length + 1}`, value: '' };
  const dataObj = ref({});

  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
    dataObj.value = _.reduce(
      list,
      (result, item) => {
        result[item.key] = item.value;
        return result;
      },
      {}
    );
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  const getLabelList = (data) => {
    labelList.value = [];
    const labelKeys = keys(data);
    labelList.value = map(labelKeys, (k) => {
      return {
        key: k,
        value: get(data, k)
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

  return {
    labelList,
    validateTrigger,
    labelItem,
    dataObj,
    resetStatus,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList
  };
}
