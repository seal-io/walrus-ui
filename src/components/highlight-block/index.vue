<template>
  <div class="high-light-wrapper" :class="{ dark: appStore.isDark }">
    <CodeViewer :lang="lang" :code="code" />
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import CodeViewer from './code-viewer.vue';

  defineProps({
    code: {
      type: String,
      default() {
        return '';
      }
    },
    lang: {
      type: String,
      default() {
        return 'json';
      }
    }
  });
  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .high-light-wrapper {
    text-align: left;

    :deep(.hljs) {
      background-color: var(--color-white);
    }

    &.dark {
      :deep(.hljs) {
        color: rgba(255, 255, 255, 0.5);
      }

      :deep(.hljs-punctuation) {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
</style>
