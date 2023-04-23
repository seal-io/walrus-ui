<template>
  <div class="tab-content-wrap markdown-body">
    <div v-html="content"></div>
    <!-- <a-textarea
      readonly
      :auto-size="{ minRows: 10 }"
      :model-value="get(schema, 'Readme')"
    ></a-textarea> -->
  </div>
</template>

<script lang="ts" setup>
  import 'github-markdown-css';
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
    }
  });
  const content = ref('');

  watch(
    () => props.schema,
    () => {
      const mdStr = get(props.schema, 'readme') || '';
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
    max-height: 500px;
    padding: 10px;
    overflow: auto;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);
  }
</style>
