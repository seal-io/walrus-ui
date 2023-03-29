<template>
  <div class="navbar" :class="{ 'full-screen': fullScreen }">
    <div class="left-side">
      <a-space>
        <img
          alt="logo"
          class="logo"
          src="../../assets/images/seal-logo.png"
          @click="handleToHome"
        />
        <!-- <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        /> -->
      </a-space>
    </div>
    <div v-if="hasNavList" class="nav-list">
      <nav-list :list="navDataList" :default-active="defaultActive"></nav-list>
    </div>
    <ul class="right-side">
      <!-- <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->

      <li id="langWrap" style="position: relative">
        <a-tooltip
          :content="$t('settings.language')"
          popup-container="#langWrap"
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown
          trigger="click"
          style="top: 36px; z-index: 3000; width: 70px"
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
      <!-- <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <!-- <li v-show="hasNavList">
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                class="nav-btn"
                type="outline"
                :shape="'circle'"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box />
          </template>
        </a-popover>
      </li> -->
      <li v-show="hasNavList" :class="{ active: defaultActive === 'user' }">
        <a-tooltip :content="$t('settings.system')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li v-show="hasNavList">
        <a-dropdown trigger="click">
          <div>
            <a-avatar
              :size="32"
              :style="{
                cursor: 'pointer',
                backgroundColor: 'rgba(201, 205, 212, 30%)'
              }"
            >
              <img alt="avatar" src="../../assets/images/avatar-02.png" />
            </a-avatar>
          </div>
          <template #content>
            <!-- <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption>
              <a-space @click="handleModifyPassword">
                <icon-lock />
                <span>
                  {{ $t('account.settings.title') }}
                </span>
              </a-space>
            </a-doption>
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="handleToSetting">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
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
  import { get, hasIn, includes } from 'lodash';
  import { isLogin } from '@/utils/auth';
  import { useRouter } from 'vue-router';
  import { computed, ref, inject, toRaw, nextTick } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore, useTabBarStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import { listenerRouteChange } from '@/utils/route-listener';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import MessageBox from '../message-box/index.vue';
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
      name: 'SystemSetting'
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
    const permissions = get(userStore, `permissions.${newRoute.fullPath}`);
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
      from,
      permissions: toRaw(permissions)
    });
  }, true);

  const refBtn = ref();
  const triggerBtn = ref();
  const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    refBtn.value.dispatchEvent(event);
  };
  const handleLogout = () => {
    logout();
  };
  const handleModifyPassword = () => {
    router.push({
      name: 'ModifyPassword'
    });
  };
  const handleToHome = () => {
    router.push({
      name: 'DashboardMain'
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
  const handleToSetting = () => {
    router.push({
      name: 'Setting'
      // query: {
      //   redirectPath: router.currentRoute.value.fullPath,
      // },
    });
  };
  // if (isLogin()) {
  //   userStore.getUserSetting();
  // }
</script>

<style scoped lang="less">
  .search-icon {
    cursor: pointer;
  }

  .navbar {
    padding: 0 20px;
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
    height: 100%;
    margin: 0 auto;
    background-color: var(--seal-color-bg-1);
    // border-bottom: 1px solid var(--color-border);
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
</style>
