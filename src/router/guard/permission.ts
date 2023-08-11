import type { Router, LocationQueryRaw } from 'vue-router';
import i18n from '@/locale/index';
import NProgress from 'nprogress'; // progress bar
import { Modal } from '@arco-design/web-vue';
import { h } from 'vue';
import usePermission from '@/hooks/permissions';
import { useUserStore } from '@/store';
import { LoginRouteName } from '@/api/config';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // =======no permission check in frontend=====
    if (to.meta.noLogin) {
      next();
      return;
    }
    // =======no permission check in frontend=====

    const userStore = useUserStore();
    const Permission = usePermission(to);

    // when forbidden to use password-free login from ui only need userStore.name && userStore?.userSetting?.FirstLogin?.value
    if (userStore.name && !userStore.isFirstLogin()) {
      if (to.name === LoginRouteName) {
        const destination = Permission.getFirstRouteName(appRoutes) || {
          name: 'forbidden'
        };
        next({
          name: destination as string
        });
        return;
      }
      if (Permission.accessRouter(to)) {
        next();
        return;
      }
      next({ name: 'forbidden', replace: true });
    } else {
      // if (userStore.isFirstLogin() && userStore.name) {
      //   Modal.warning({
      //     alignCenter: false,
      //     top: '20%',
      //     title: i18n.global.t('login.form.login.update'),
      //     okText: i18n.global.t('common.button.confirm'),
      //     content: () =>
      //       h(
      //         'div',
      //         { style: { 'text-align': 'center' } },
      //         i18n.global.t('login.form.login.complete')
      //       )
      //   });
      // }
      if (to.name === LoginRouteName) {
        next();
        return;
      }
      next({
        name: LoginRouteName
      });
    }
  });
  router.afterEach(() => {
    NProgress.done();
  });
}
