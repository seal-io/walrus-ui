import { Modal } from '@arco-design/web-vue';
import i18n from '@/locale/index';
import { h } from 'vue';

export const globalModal = async (options?) => {
  await Modal[options?.type || 'warning']({
    hideCancel: true,
    okText: i18n.global.t('common.button.confirm'),
    cancelText: i18n.global.t('common.button.cancel'),
    title: i18n.global.t('common.tips.title'),
    content: () => {
      return h(
        'div',
        { style: { 'text-align': 'center' } },
        i18n.global.t(options?.contentText)
      );
    },
    ...options,
  });
};

export default {
  globalModal,
};
