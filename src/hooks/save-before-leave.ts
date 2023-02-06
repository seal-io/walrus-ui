import { Modal } from '@arco-design/web-vue';
import i18n from '@/locale/index';
import { RouteLocationNormalized } from 'vue-router';
import { h } from 'vue';

let GLOBAL_BEFORE_LEAVE_MODAL: any = null;

export const beforeLeaveCallback = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  onOk
) => {
  GLOBAL_BEFORE_LEAVE_MODAL?.close?.();
  GLOBAL_BEFORE_LEAVE_MODAL = await Modal.warning({
    hideCancel: false,
    okText: i18n.global.t('common.button.discard'),
    cancelText: i18n.global.t('common.button.cancel'),
    title: i18n.global.t('common.tips.discard'),
    content: () => {
      return h(
        'div',
        { style: { 'text-align': 'center' } },
        i18n.global.t('common.tips.save')
      );
    },
    onOk,
  });
};

export default {
  beforeLeaveCallback,
};
