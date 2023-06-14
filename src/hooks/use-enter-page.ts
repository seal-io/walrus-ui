import appRoutes from '@/router/routes';
import { useRouter, RouteRecordRaw } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { get } from 'lodash';
import { useUserStore } from '@/store';

export default function useEnterPage() {
  const router = useRouter();
  const userStore = useUserStore();
  const { t } = useI18n();
  const getFirstRouteName = () => {
    const firstChildren = get(appRoutes, '0.children');
    const firstName = get(appRoutes, '0.name');
    if ((!firstChildren || !firstChildren.length) && !firstName)
      return 'notFound';
    if (firstChildren && firstChildren.length) {
      return get(firstChildren, '0.name');
    }
    return firstName;
  };

  const enterUserPage = async () => {
    const firstRouteName = getFirstRouteName();
    console.log('firstRouteName:', firstRouteName);
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: firstRouteName
      // query: {
      //   ...othersQuery,
      // },
    });
    Message.success({
      content: t('login.form.login.success'),
      duration: 3000
    });
  };
  return {
    enterUserPage
  };
}
