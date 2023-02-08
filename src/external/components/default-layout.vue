<template>
  <a-layout class="layout">
    <div class="layout-navbar">
      <nav-bar></nav-bar>
    </div>
    <a-layout class="main-layout">
      <a-layout class="layout-content">
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import navBar from './nav-bar.vue';
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
    padding-top: @nav-size-height;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    // background-color: #fff;
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
