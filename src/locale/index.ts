import { createI18n } from 'vue-i18n';
import { usePreferredLanguages } from '@vueuse/core';
import en from './en-US';
import cn from './zh-CN';

export const LOCALE_OPTIONS = [
  {
    label: '中文',
    value: 'zh-CN',
    icon: 'icon-fuhao-zhongwen',
    supportLang: 'zh'
  },
  { label: 'English', value: 'en-US', icon: 'icon-english', supportLang: 'en' }
];
const languages = usePreferredLanguages();
const browserLanguage = languages.value[0] || 'en-US';

const defaultLanguage = browserLanguage.indexOf('zh') > -1 ? 'zh-CN' : 'en-US';

const defaultLocale = localStorage.getItem('seal-locale') || defaultLanguage;

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': cn
  }
});
export default i18n;
