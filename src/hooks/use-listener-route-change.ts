import _ from 'lodash';
import { ref, nextTick } from 'vue';
import { listenerRouteChange } from '@/utils/route-listener';
import { useAppStore, useUserStore, useTabBarStore } from '@/store';
import { NO_LOGIN_CHECK_PATH } from '@/components/navbar/configs';
import useCallCommon from './use-call-common';

export default function useListenerRouteChange() {
  const { router } = useCallCommon();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const defaultActive = ref<string>('TotalView');

  const noLoginCheckRoute = (name): boolean => {
    return _.includes(NO_LOGIN_CHECK_PATH, name);
  };

  const updateCacheList = (toRoute, from) => {
    const currentRoute = router.currentRoute.value;
    const to_ignoreCache = _.get(toRoute, 'meta.ignoreCache');
    const from_cachePages = _.get(from, 'meta.cachePages') || [];
    // to
    if (!to_ignoreCache) {
      tabBarStore.updateTabList(toRoute);
    }

    // from
    if (
      !_.get(from, 'meta.ignoreCache') &&
      !from_cachePages.includes(toRoute.name)
    ) {
      tabBarStore.deleteTag(0, {
        title: '',
        name: from.name as string,
        fullPath: from.fullPath
      });
    }
  };

  const handleControlNavShow = (newRoute) => {
    console.log('newRoute========', newRoute);
    const needNavList =
      _.hasIn(newRoute.meta, 'hasNavList') &&
      !_.get(newRoute, 'meta.hasNavList');
    if (needNavList || noLoginCheckRoute(newRoute.name)) {
      appStore.updateSettings({ hasNavList: false });
    } else {
      appStore.updateSettings({ hasNavList: true });
    }
  };

  const setPageFullScreen = (newRoute) => {
    appStore.updateSettings({ fullScreen: newRoute?.meta?.fullScreen });
  };

  const execListenerRouteChange = () => {
    listenerRouteChange(async ({ to: newRoute, from }) => {
      defaultActive.value = newRoute.matched[1]?.name as string;
      updateCacheList(newRoute, from);
      // handleControlNavShow(newRoute);
      // setPageFullScreen(newRoute);
      // nextTick(() => {
      //   setTimeout(() => {
      //     handleControlMenuShow(newRoute);
      //   }, 100);
      // });
      console.log('listenerRouteChange=======', {
        to: newRoute,
        from
      });
    }, true);
  };
  return execListenerRouteChange;
}
