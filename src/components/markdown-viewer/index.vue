<template>
  <div
    class="content-wrap markdown-body"
    :style="{ height }"
    :class="{ dark: appStore.theme === 'dark' }"
  >
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts" setup>
  import 'github-markdown-css/github-markdown-light.css';
  import { useAppStore } from '@/store';
  import { watch, ref, nextTick } from 'vue';
  import { marked } from 'marked';

  const props = defineProps({
    mdStr: {
      type: String,
      default() {
        return '';
      }
    },
    height: {
      type: String,
      default() {
        return 'auto';
      }
    }
  });
  const appStore = useAppStore();
  const content = ref('');

  const openNewTab = () => {
    const aList = document.querySelectorAll('.readme-content a');
    aList?.forEach((item) => {
      item.setAttribute('target', '_blank');
    });
  };

  watch(
    () => props.mdStr,
    () => {
      content.value = marked.parse(props.mdStr);
      nextTick(() => {
        openNewTab();
      });
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .content-wrap {
    min-height: 200px;
    padding: 10px;
    overflow: auto;
    font-size: 12px !important;
    background-color: var(--color-fill-1);
    border-radius: var(--border-radius-small);

    &.markdown-body {
      color: var(--color-text-2);
      font-family: 'noto sans', sans-serif;

      &.dark {
        :deep(h2),
        :deep(h1),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
          border-color: hsla(210, 18%, 87%, 0.2);
        }

        :deep(table) {
          tr {
            background-color: var(--color-white);
          }

          td,
          th {
            border-color: var(--color-border-2);
          }
        }

        :deep(pre) {
          color: var(--color-text-2);
          background-color: var(--color-white);
        }
      }
    }
  }
</style>
