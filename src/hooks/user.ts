import { Message } from '@arco-design/web-vue';
import { useUserStore, useAppStore, useProjectStore } from '@/store';
import useCallCommon from './use-call-common';

export default function useUser() {
  const { router, t } = useCallCommon();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const projectStore = useProjectStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success(t('common.logout.msg'));
    userStore.resetInfo();
    appStore.resetInfo();
    projectStore.resetInfo();
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'Login',
      query: {
        // ...router.currentRoute.value.query,
        // redirect: currentRoute.name as string,
      }
    });
  };
  return {
    logout
  };
}
