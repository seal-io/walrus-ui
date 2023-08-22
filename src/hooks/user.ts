import { Message } from '@arco-design/web-vue';
import {
  useUserStore,
  useAppStore,
  useProjectStore,
  useServiceStore,
  useActiveTabsStore
} from '@/store';
import useCallCommon from './use-call-common';

export default function useUser() {
  const { router, t } = useCallCommon();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const projectStore = useProjectStore();
  const serviceStore = useServiceStore();
  const activeTabsStore = useActiveTabsStore();

  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    Message.success(t('common.logout.msg'));
    userStore.resetInfo();
    appStore.resetInfo();
    projectStore.resetInfo();
    serviceStore.resetInfo();
    activeTabsStore.resetInfo();
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'Login'
    });
  };
  return {
    logout
  };
}
