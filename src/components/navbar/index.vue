<template>
  <div class="navbar" :class="{ 'full-screen': fullScreen }">
    <div class="left-side">
      <div>
        <img
          alt="logo"
          class="logo"
          src="../../assets/images/logo2.png"
          @click="handleToHome"
        />
      </div>
    </div>
    <div v-if="hasNavList" class="nav-list">
      <nav-list :list="navDataList" :default-active="defaultActive"></nav-list>
    </div>
    <ul class="right-side">
      <li id="langWrap" style="position: relative">
        <a-button
          size="small"
          class="nav-btn"
          type="text"
          :shape="'circle'"
          @click="setDropDownVisible"
        >
          <template #icon>
            <i
              class="iconfont icon-language size-20"
              style="color: var(--color-text-2)"
            ></i>
          </template>
        </a-button>
        <a-dropdown
          trigger="click"
          style="top: 35px; z-index: 3000; width: 70px"
          popup-container="#langWrap"
          @select="changeLocale"
        >
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li v-show="hasNavList" id="userWrap" style="position: relative">
        <a-dropdown
          trigger="click"
          style="top: 35px"
          popup-container="#userWrap"
          content-class="count-list-wrap"
        >
          <div style="cursor: pointer" class="user-wrap">
            <span class="user">
              <span class="role">
                <!-- <span class="avatar">
                  <img
                    alt="avatar"
                    class="img"
                    src="../../assets/images/avatar-02.png"
                  />
                </span> -->
                <a-avatar
                  class="mright-5"
                  :style="{ backgroundColor: 'var(--sealblue-6)' }"
                  :size="22"
                >
                  <IconUser class="size-16" /> </a-avatar
                >{{ userStore.name }}</span
              >
            </span>
          </div>
          <template #content>
            <a-doption>
              <a-space @click="handleModifyPassword">
                <icon-user style="color: inherit" />
                <span>
                  {{ $t('propfile.account.user.title') }}
                </span>
              </a-space>
            </a-doption>

            <a-doption>
              <a-space style="width: 100%" @click="handleLogout">
                <icon-export style="color: inherit" />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { SYSTEMSETTINGS, PROFILE, DASHBOARD } from '@/router/config';
  import _, { get, hasIn, includes } from 'lodash';
  import { useRouter } from 'vue-router';
  import { computed, ref, inject, toRaw, nextTick } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore, useTabBarStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import { listenerRouteChange } from '@/utils/route-listener';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import { RoleType, RolesTypeMap } from '@/views/system/config/users';
  import navList from './components/nav-list.vue';
  import { NO_LOGIN_CHECK_PATH, navDataList } from './configs';

  defineProps({
    fullScreen: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const { logout } = useUser();
  const { changeLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];
  const avatar = computed(() => {
    return userStore.avatar;
  });
  const hasNavList = computed(() => {
    return appStore.hasNavList;
  });
  console.log('useUserStore===', userStore);
  const defaultActive = ref<string>('TotalView');
  const theme = computed(() => {
    return appStore.theme;
  });
  const getUserRole = computed(() => {
    const { roles } = userStore;
    const admin = _.find(roles, (item) => item.id === RoleType.Admin);
    if (admin) {
      return _.get(RolesTypeMap, admin.id);
    }
    const engnieer = _.find(roles, (item) => item.id === RoleType.Engineer);
    if (engnieer) {
      return _.get(RolesTypeMap, engnieer.id);
    }
    return _.get(RolesTypeMap, RoleType.User);
  });
  const isDark = useDark({
    selector: '.navbar',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridded default behavior
      appStore.toggleTheme(dark);
    }
  });
  const toggleTheme = useToggle(isDark);
  const setVisible = () => {
    router.push({
      name: SYSTEMSETTINGS.Settings
    });
    // appStore.updateSettings({ globalSettings: true });
  };

  // control menu show
  const handleControlMenuShow = (newRoute) => {
    const hideMenu = get(newRoute, 'meta.hideMenu');
    appStore.toggleMenu(hideMenu);
    // appStore.updateSettings({ hideMenu });
  };

  // set nav if show by login status and routes
  const noLoginCheckRoute = (name): boolean => {
    return includes(NO_LOGIN_CHECK_PATH, name);
  };
  const handleControlNavShow = (newRoute) => {
    console.log('newRoute========', newRoute);
    const needNavList =
      hasIn(newRoute.meta, 'hasNavList') && !get(newRoute, 'meta.hasNavList');
    if (needNavList || noLoginCheckRoute(newRoute.name)) {
      appStore.updateSettings({ hasNavList: false });
    } else {
      appStore.updateSettings({ hasNavList: true });
    }
  };
  const updateCacheList = (toRoute, from) => {
    const currentRoute = router.currentRoute.value;
    const to_ignoreCache = get(toRoute, 'meta.ignoreCache');
    const from_cachePages = get(from, 'meta.cachePages') || [];
    // to
    if (!to_ignoreCache) {
      tabBarStore.updateTabList(toRoute);
    }

    // from
    if (
      !get(from, 'meta.ignoreCache') &&
      !from_cachePages.includes(toRoute.name)
    ) {
      tabBarStore.deleteTag(0, {
        title: '',
        name: from.name as string,
        fullPath: from.fullPath
      });
    }
  };
  const setPageFullScreen = (newRoute) => {
    appStore.updateSettings({ fullScreen: newRoute?.meta?.fullScreen });
  };
  listenerRouteChange(async ({ to: newRoute, from }) => {
    defaultActive.value = newRoute.matched[1]?.name as string;
    handleControlNavShow(newRoute);
    updateCacheList(newRoute, from);
    setPageFullScreen(newRoute);
    nextTick(() => {
      setTimeout(() => {
        handleControlMenuShow(newRoute);
      }, 100);
    });
    console.log('listenerRouteChange=======', {
      to: newRoute,
      from
    });
  }, true);

  const refBtn = ref();
  const triggerBtn = ref();

  const handleLogout = () => {
    logout();
  };
  const handleModifyPassword = () => {
    router.push({
      name: PROFILE.UserCenter
    });
  };
  const handleToHome = () => {
    router.push({
      path: '/'
    });
  };
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    triggerBtn.value.dispatchEvent(event);
  };
  const switchRoles = async () => {
    const res = await userStore.switchRoles();
    Message.success(res as string);
  };
  const toggleDrawerMenu = inject('toggleDrawerMenu');
</script>

<style scoped lang="less">
  .search-icon {
    cursor: pointer;
  }

  .navbar {
    padding: 0 10px;
  }

  .user-wrap {
    display: flex;

    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 5px;
      color: #fff;
      font-size: 14px;

      .name {
        margin-bottom: 3px;
      }

      .role {
        display: flex;
        align-items: center;
        color: var(--color-text-2);
      }

      .avatar {
        margin-right: 2px;
        font-size: 0;

        .img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  @media screen and (min-width: 1512px) {
    .navbar {
      box-sizing: border-box;
      // width: 1440px;
    }

    .navbar.full-screen {
      width: 100%;
      padding-right: 20px;
      padding-left: 20px;
    }
  }
  @media screen and (max-width: 1511px) {
    .navbar {
      box-sizing: border-box;
      width: 100%;
      padding-right: 20px;
    }

    .navbar.full-screen {
      width: 100%;
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    height: 48px;
    margin: 0 auto;
    background-color: #fff;
    border-bottom: 1px solid var(--color-border-1);

    :deep(.arco-typography) {
      color: #fff;
    }
  }

  .nav-list {
    display: flex;
  }

  .left-side {
    display: flex;
    align-items: center;
    // padding-left: 5px;
    :deep(.arco-space-item) {
      font-size: 0;
    }

    .logo {
      width: 100px;
      height: auto;
      cursor: pointer;
    }
  }

  .right-side {
    display: flex;
    list-style: none;
    // padding-right: 10px;
    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;

      &:last-child {
        padding-right: 0;
      }
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: var(--seal-color-text-1);
    }

    svg {
      color: var(--seal-color-text-1);
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }

    :deep(li.active) {
      .arco-btn-size-medium.arco-btn-shape-circle {
        border-color: #fff;
        border-width: 2px;

        .arco-icon {
          color: #fff;
          transform: scale(1.3);
        }
      }
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }

  .arco-trigger-content.count-list-wrap {
    .arco-dropdown-option-content {
      flex: 1;
    }
  }
</style>
