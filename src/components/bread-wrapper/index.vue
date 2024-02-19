<template>
  <div
    class="bread-wrapper"
    :style="{
      height: `${appStore.navbarHeight}px`,
      left: appStore.menuCollapse
        ? `${appStore.smallWidth}px`
        : `${appStore.menuWidth}px`
    }"
    :class="{
      menuCollapse: appStore.menuCollapse,

      islazy: isLazy
    }"
  >
    <div class="content">
      <div
        v-show="show"
        :class="{ show: show }"
        :style="{
          'display': 'flex',
          'align-items': 'center',
          'height': `${appStore.navbarHeight}px`,
          'paddingTop': '0px'
        }"
      >
        <slot></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useAppStore } from '@/store';

  defineProps({
    isLazy: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const appStore = useAppStore();
  const show = ref(false);
  onMounted(() => {
    show.value = true;
  });
</script>

<style lang="less" scoped>
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .bread-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-fill-1);
    // border-bottom: 1px solid var(--color-border-1);
    transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-left: var(--card-content-padding);
      background-color: var(--color-white);
      border-radius: 24px 0 0 0;
    }

    &.islazy {
      z-index: 900;
    }

    .show {
      animation: fadeIn 0.6s var(--seal-transition-func);
    }
  }
</style>
