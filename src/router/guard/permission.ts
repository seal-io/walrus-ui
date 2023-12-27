import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permissions';
import { useUserStore } from '@/store';
import { LoginRouteName } from '@/api/config';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const userStore = useUserStore();
    const Permission = usePermission(to);

    // when forbidden to use password-free login from ui only need userStore.name && userStore?.userSetting?.FirstLogin?.value
    if (userStore.name && !userStore.isFirstLogin()) {
      // path to '/' redirect to 'login'
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
