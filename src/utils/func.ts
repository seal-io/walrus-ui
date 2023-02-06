import { useI18n } from 'vue-i18n';

export const getListLabel = (value, list) => {
  const data = list.find((item) => item.value === value);
  return data ? data.label : '';
};

export const useLocaleKey = () => {
  const { locale, messages } = useI18n();
  const localeKey = (key) => {
    const lang = locale.value;
    return !!messages.value[lang][key];
  };
  return {
    localeKey,
  };
};

export default {};
