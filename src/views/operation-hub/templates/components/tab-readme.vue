<template>
  <div class="tab-content-wrap">
    <markdownViewer :height="height" :md-str="mdStr"></markdownViewer>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType, computed } from 'vue';
  import markdownViewer from '@/components/markdown-viewer/index.vue';
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
  const mdStr = computed(() => get(props.schema, 'data.readme') || '');
</script>

<style lang="less" scoped>
  .tab-content-wrap {
    :deep(.arco-textarea) {
      background-color: var(--color-fill-2);
    }
  }
</style>
