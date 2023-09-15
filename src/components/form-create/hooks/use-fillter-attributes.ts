import { reactive, ref, toRaw, toRefs } from 'vue';
import _ from 'lodash';
import { checkHasValue } from '../config/utils';

export default function useFillterAttributes(formData) {
  // const { formData } = toRefs(props);
  const queryName = ref('');
  const checkHasValueCache = new Set();
  const filterParams = reactive({
    required: '',
    hasValue: '',
    name: ''
  });

  const handleQueryChange = (val) => {
    filterParams.name = val;
  };
  const handleClear = () => {
    filterParams.required = '';
    filterParams.hasValue = '';
    filterParams.name = '';
    queryName.value = '';
  };

  const handleCheckHasValueChange = () => {
    checkHasValueCache.clear();
  };

  const filterFields = (sItem) => {
    let required = true;
    let hasValue = true;
    let matchName = true;
    if (filterParams.required === 'true') {
      required = sItem.required;
    } else if (filterParams.required === 'false') {
      required = !sItem.required;
    }

    if (filterParams.hasValue) {
      hasValue = checkHasValue(toRaw(formData.value[sItem.name]));
      if (filterParams.hasValue === 'false') {
        hasValue = !hasValue;
      }
      if (hasValue) {
        checkHasValueCache.add(sItem.name);
      }
      hasValue = hasValue || checkHasValueCache.has(sItem.name);
    }

    if (filterParams.name) {
      const name = _.toLower(filterParams.name);
      matchName =
        _.includes(_.toLower(sItem.name), name) ||
        _.includes(_.toLower(sItem.label), name);
    } else if (!filterParams.name) {
      matchName = true;
    }
    return required && hasValue && matchName;
  };

  return {
    queryName,
    filterParams,
    handleQueryChange,
    handleClear,
    filterFields,
    handleCheckHasValueChange
  };
}
