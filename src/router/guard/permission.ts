import type { Router, LocationQueryRaw } from 'vue-router';
import i18n from '@/locale/index';
import NProgress from 'nprogress'; // progress bar
import { Modal } from '@arco-design/web-vue';
import { h } from 'vue';
import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import appRoutes from '../routes';

const LoginRouteName = 'Login';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // =======no permission check in frontend=====
    if (to.meta.noLogin) {
      next();
      NProgress.done();
      return;
    }
    // =======no permission check in frontend=====

    const userStore = useUserStore();

    // ============ remove under line when always verify permission =========
    // if (userStore.userSetting?.EnableAuth?.value === 'false') {
    //   next();
    //   NProgress.done();
    //   return;
    // }
    // ================ end =====================

    // const settings = await userStore.getUserSetting()
    async function crossroads() {
      const Permission = usePermission();
      if (Permission.accessRouter(to)) next();
      else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.role
        ) || {
          name: 'notFound'
        };
        next(destination);
      }
      NProgress.done();
    }

    if (
      (userStore.name &&
        userStore?.userSetting?.FirstLogin?.value === 'false') ||
      userStore.name
    ) {
      if (to.name === LoginRouteName) {
        const Permission = usePermission();
        const destination = Permission.getFirstRouteName(appRoutes) || {
          name: 'notFound'
        };
        next({
          name: destination
        });
        NProgress.done();
        return;
      }
      next();
      // if (userStore.role) {
      //   crossroads();
      // } else {
      //   try {
      //     await userStore.info();
      //     crossroads();
      //   } catch (error) {
      //     next({
      //       name: 'Login',
      //       query: {} as LocationQueryRaw
      //     });
      //     NProgress.done();
      //   }
      // }
    } else {
      if (
        userStore?.userSetting?.FirstLogin?.value === 'true' &&
        userStore.name
      ) {
        Modal.warning({
          alignCenter: false,
          top: '20%',
          title: i18n.global.t('login.form.login.update'),
          okText: i18n.global.t('common.button.confirm'),
          content: () =>
            h(
              'div',
              { style: { 'text-align': 'center' } },
              i18n.global.t('login.form.login.complete')
            )
        });
      }
      if (to.name === LoginRouteName) {
        next();
        NProgress.done();
        return;
      }
      next({
        name: LoginRouteName
      });
      NProgress.done();
    }
  });
}
