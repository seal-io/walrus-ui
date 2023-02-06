import { App, ComponentPublicInstance, h } from 'vue';
import axios from 'axios';
import { Modal } from '@arco-design/web-vue';
import i18n from '@/locale/index';

export default function handleError(Vue: App, baseUrl: string) {
  if (!baseUrl) {
    return;
  }
  Vue.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => {
    // send error info
    axios.post(`${baseUrl}/report-error`, {
      err,
      instance,
      info,
      // location: window.location.href,
      // message: err.message,
      // stack: err.stack,
      // browserInfo: getBrowserInfo(),
      // user info
      // dom info
      // url info
      // ...
    });
  };
}

export const deleteModal = async ({ onOk }) => {
  Modal.warning({
    alignCenter: false,
    top: '20%',
    hideCancel: false,
    title: i18n.global.t('common.delete.tips'),
    content: '',
    okText: i18n.global.t('common.button.confirm'),
    cancelText: i18n.global.t('common.button.cancel'),
    onOk,
  });
};
