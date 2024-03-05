<template>
  <div class="high-light-wrapper" :class="{ dark: appStore.isDark }">
    <hljsVuePlugin.component :language="lang" :code="code" />
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import 'highlight.js/lib/common';
  import hljsVuePlugin from '@highlightjs/vue-plugin';
  import 'highlight.js/styles/atom-one-light.css';

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
