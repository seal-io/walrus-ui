<template>
  <div class="tab-content-wrap">
    {{ content }}
    <!-- <a-textarea
      readonly
      :auto-size="{ minRows: 10 }"
      :model-value="get(schema, 'Readme')"
    ></a-textarea> -->
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType, computed } from 'vue';
  import { Schema } from '../config/interface';

  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    }
  });
  const content = computed(() => {
    const list = get(props.schema, 'Readme');
    return list || '';
  });
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
    overflow: auto;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);
  }
</style>
