<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <BreadWrapper is-lazy> </BreadWrapper>
    <a-layout
      class="main-layout"
      :class="{ 'full-screen': appStore.fullScreen }"
    >
      <a-layout>
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{
            paddingTop: navbar ? `${appStore.navbarHeight + 2}px` : ''
          }"
          :hide-trigger="true"
        >
          <div
            class="logo-wrapper"
            :class="{ menuCollapse: appStore.menuCollapse }"
            @click="handleBackHome"
          >
            <div>
              <img alt="logo" class="logo" src="../assets/images/logo_02.png" />
            </div>
          </div>
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content class="page-content-wrap">
            <PageLayout />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { DASHBOARD } from '@/router/config';
  import { ref, computed, watch, provide } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import Menu from '@/components/menu/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permissions';
  import useResponsive from '@/hooks/responsive';
  import PageLayout from './page-layout.vue';

  const drawerVisible = ref(false);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });

  const navbar = computed(() => appStore.navbar);
  const renderMenu = computed(() => appStore.menu);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? appStore.smallWidth : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value + 10}px` }
        : {};
    const paddingTop = navbar.value
      ? { paddingTop: `${appStore.navbarHeight + 10}px` }
      : {};
    return { ...paddingLeft, ...paddingTop, paddingRight: '10px' };
  });

  const handleBackHome = () => {
    router.push({
      name: DASHBOARD.Main
    });
  };

  watch(
    () => userStore.role,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
</script>

<style scoped lang="less">
  @nav-size-height: 48px;
  @nav-size-gap: 68px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;

    .arco-layout-sider-light {
      box-shadow: none;
    }
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    height: @nav-size-height;
    background-color: var(--seal-color-bg-1);
  }

  :deep(.main-layout.arco-layout) {
    box-sizing: border-box;
    // position: relative;
    // margin: 0 auto;
  }

  .main-layout.full-screen {
    width: 100% !important;
  }

  .layout-menu {
    position: absolute;
    top: @nav-size-gap;
    left: 0;
    width: 210px;

    :deep(.arco-menu.arco-menu-light) {
      background-color: var(--color-fill-2);

      .arco-menu-item {
        &:hover {
          color: rgb(var(--arcoblue-6));
          background-color: #fff;
        }

        &.arco-menu-selected {
          color: #fff;
          background-color: rgba(var(--arcoblue-6), 1);
        }
      }
    }
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    height: 100%;
    background-color: #fff;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    .logo-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      align-items: center;
      height: 48px;
      padding-left: 8px;
      overflow: hidden;
      font-size: 0;
      border-bottom: 1px solid var(--color-border-1);
      box-shadow: 1px 0 0 var(--color-border-1);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

      &.menuCollapse {
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
      }

      .logo {
        height: 24px;
      }

      &.menuCollapse {
        padding-left: 4px;

        .logo {
          height: 20px;
        }
      }
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;

    :deep(.arco-menu) {
      ::-webkit-scrollbar {
        width: 12px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--color-text-4);
        background-clip: padding-box;
        border: 4px solid transparent;
        border-radius: 7px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .arco-layout-footer {
    background-color: #fff;
  }

  .layout-content {
    position: relative;
    min-height: 100vh;
    overflow-y: hidden;
    font-size: 0;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    .page-content-wrap {
      background-color: #fff;
      border-radius: var(--border-radius-small);
    }
  }
</style>
