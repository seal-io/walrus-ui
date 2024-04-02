import { useI18n } from 'vue-i18n';
import _, { includes, map } from 'lodash';
import { ListQuery } from '@/types/global';

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

export const ordinalNumber = (number) => {
  const n = _.round(number);
  if (_.isNaN(n)) {
    return 0;
  }
  return n + (['st', 'nd', 'rd'][n < 20 ? n - 1 : (n % 10) - 1] || 'th');
};

export const generateListParams = (params: ListQuery) => {
  const { listOptions } = params;
  const result = _.reduce(
    listOptions,
    (obj, value, key) => {
      if (listOptions && listOptions[key]) {
        if (_.isArray(listOptions[key])) {
          obj[`listOptions.${key}`] = listOptions[key].join(',');
        }
        obj[key] = value;
      }
      return obj;
    },
    {}
  );
  return {
    ...result,
    ..._.omit(params, ['listOptions'])
  };
};

export default {};
