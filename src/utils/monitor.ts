import { App, ComponentPublicInstance, h, compile } from 'vue';
import axios from 'axios';
import { Modal, Message } from '@arco-design/web-vue';
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
      info
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

export const deleteModal = async ({
  onOk,
  content,
  title = 'common.delete.tips',
  okText = 'common.button.confirm'
}: {
  onOk: () => void;
  content?: string;
  title?: string;
  okText?: string;
}) => {
  Modal.warning({
    alignCenter: false,
    top: '20%',
    hideCancel: false,
    title: i18n.global.t(title),
    content: () => {
      return h(
        'div',
        {
          style: {
            'text-align': 'center',
            'white-space': 'pre-wrap',
            'line-height': 1.6
          }
        },
        i18n.global.t(content || '')
      );
    },
    okText: i18n.global.t(okText),
    cancelText: i18n.global.t('common.button.cancel'),
    onOk
  });
};

export const execSucceed = () => {
  Message.success(i18n.global.t('common.message.success'));
};
