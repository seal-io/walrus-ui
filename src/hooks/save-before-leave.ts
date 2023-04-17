import { Modal } from '@arco-design/web-vue';
import i18n from '@/locale/index';
import { RouteLocationNormalized } from 'vue-router';
import { h } from 'vue';

let GLOBAL_BEFORE_LEAVE_MODAL: any = null;

export const beforeLeaveCallback = async ({
  to,
  from,
  isCancel,
  onOk
}: {
  to?: RouteLocationNormalized;
  from?: RouteLocationNormalized;
  isCancel?: boolean;
  onOk: () => void;
}) => {
  GLOBAL_BEFORE_LEAVE_MODAL?.close?.();
  GLOBAL_BEFORE_LEAVE_MODAL = await Modal.warning({
    top: '15%',
    hideCancel: false,
    okText: i18n.global.t('common.button.discard'),
    cancelText: i18n.global.t('common.button.cancel'),
    cancelButtonProps: {
      type: 'outline'
    },
    title: i18n.global.t('common.tips.discard'),
    content: () => {
      return h(
        'div',
        { style: { 'text-align': 'center' } },
        isCancel
          ? i18n.global.t('common.tips.cancel')
          : i18n.global.t('common.tips.save')
      );
    },
    onOk
  });
};

export default {
  beforeLeaveCallback
};
