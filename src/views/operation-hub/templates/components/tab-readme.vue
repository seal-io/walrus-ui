<template>
  <div
    class="tab-content-wrap markdown-body"
    :style="{ height }"
    :class="{ dark: appStore.theme === 'dark' }"
  >
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts" setup>
  import 'github-markdown-css/github-markdown-light.css';
  import { useAppStore } from '@/store';
  import { get } from 'lodash';
  import { PropType, computed, watch, ref } from 'vue';
  import { marked } from 'marked';
  import { Schema } from '../config/interface';

  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default() {
        return '100%';
      }
    }
  });
  const appStore = useAppStore();
  const content = ref('');

  watch(
    () => props.schema,
    () => {
      const mdStr = get(props.schema, 'schema.readme') || '';
      content.value = marked.parse(mdStr);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  .tab-content-wrap {
    :deep(.arco-textarea) {
      background-color: var(--color-fill-2);
    }
  }

  .tab-content-wrap {
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
          background-color: var(--color-white) !important;
        }
      }
    }
  }
</style>
