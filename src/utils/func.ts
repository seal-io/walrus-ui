import { useI18n } from 'vue-i18n';
import _, { includes, map } from 'lodash';

export const getListLabel = (value, list, obj?) => {
  const l = obj?.label || 'label';
  const v = obj?.value || 'value';
  const data = _.find(list, (item) => _.get(item, v) === value);
  return data ? _.get(data, l) : '';
};
export const getLabelList = (values, list, obj?) => {
  const l = obj?.label || 'label';
  const v = obj?.value || 'value';
  const data = list.filter((item) => includes(values, item[v]));
  return map(data, (sItem) => {
    return sItem[l];
  });
};

export const useLocaleKey = () => {
  const { locale, messages } = useI18n();
  const localeKey = (key) => {
    const lang = locale.value;
    return !!messages.value[lang][key];
  };
  return {
    localeKey
  };
};

export default {};
