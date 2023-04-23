<template>
  <div class="tab-content-wrap">
    <a-textarea
      readonly
      :auto-size="{ minRows: 10 }"
      :model-value="get(schema, 'resources')"
    ></a-textarea>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { Schema } from '../config/interface';

  defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    }
  });
</script>

<style lang="less" scoped>
  .tab-content-wrap {
    :deep(.arco-textarea) {
      background-color: var(--color-fill-2);
    }
  }
</style>
