<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <div v-if="navbar" class="layout-navbar">
      <NavBar />
    </div>
    <a-layout
      class="main-layout"
      :class="{ 'full-screen': appStore.fullScreen }"
    >
      <a-layout>
        <!-- <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <Menu />
        </a-drawer> -->
        <a-layout class="layout-content" :style="paddingStyle">
          <!-- <TabBar v-if="appStore.tabBar" /> -->
          <div v-if="!hideMenu" class="layout-menu">
            <Menu />
          </div>
          <a-layout-content>
            <PageLayout />
          </a-layout-content>
          <!-- <Footer v-if="footer" /> -->
        </a-layout>
      </a-layout>
    </a-layout>
    <Footer v-if="footer" />
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, provide } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Footer from '@/components/footer/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import PageLayout from './page-layout.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const navbar = computed(() => appStore.navbar);
  const renderMenu = computed(() => appStore.menu);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value
      ? { paddingTop: `${appStore.navbarHeight}px` }
      : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.role,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
</script>

<style scoped lang="less">
  @nav-size-height: 56px;
  @nav-size-gap: 76px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
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
  @media screen and (min-width: 1512px) {
    .main-layout.arco-layout {
      box-sizing: border-box;
      width: 1440px;
    }
  }
  // @media screen and (max-width: 1599px) and (min-width: 1200px) {
  //   .main-layout.arco-layout {
  //     width: 100%;
  //   }
  // }
  @media screen and (max-width: 1511px) {
    .main-layout.arco-layout {
      box-sizing: border-box;
      width: 100%;
      padding: 0 20px;
    }
  }

  :deep(.main-layout.arco-layout) {
    position: relative;
    margin: 0 auto;
    // background-color: #fff;
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
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
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
    min-height: calc(100vh - 76px);
    margin-bottom: 20px;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    // background-color: #fff;
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
