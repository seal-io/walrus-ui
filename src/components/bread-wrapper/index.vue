<template>
  <div
    class="bread-wrapper"
    :style="{
      left: appStore.menuCollapse
        ? `${appStore.smallWidth}px`
        : `${appStore.menuWidth}px`
    }"
    :class="{
      menuCollapse: appStore.menuCollapse,

      islazy: isLazy
    }"
  >
    <div
      v-show="show"
      :class="{ show: show }"
      :style="{
        'display': 'flex',
        'align-items': 'center',
        'height': `48px`
      }"
    >
      <slot></slot>
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
  @CollapseLeft: 48px;
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
    width: 100%;
    height: 48px;
    padding-left: 10px;
    background-color: #fff;
    border-bottom: 1px solid var(--color-border-1);
    transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &.islazy {
      z-index: 900;
    }

    &.menuCollapse {
      left: @CollapseLeft;
      // transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    }

    .show {
      animation: fadeIn 0.6s var(--seal-transition-func);
    }
  }
</style>
