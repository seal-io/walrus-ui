<template>
  <div class="bread-wrapper" :class="{ menuCollapse: appStore.menuCollapse }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .bread-wrapper {
    position: fixed;
    top: 0;
    left: 220px;
    z-index: 1000;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    padding-left: 10px;
    background-color: #fff;
    border-bottom: 1px solid var(--color-border-1);
    transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &.menuCollapse {
      left: 48px;
      transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    }
  }
</style>
