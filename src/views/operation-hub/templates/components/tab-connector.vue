<template>
  <div class="tab-content-wrap">
    <ul>
      <li
        v-for="(item, index) in dataList"
        :key="index"
        style="line-height: 22px"
      >
        <span>{{ item.name }}</span>
        <span style="margin-left: 20px">{{
          join(item.version_constraints, ', ')
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { get, join } from 'lodash';
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
  const dataList = computed(() => {
    const list = get(props.schema, 'requiredProviders');
    return list || [];
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
    max-height: 300px;
    overflow: auto;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);

    ul {
      padding-left: 30px;
    }
  }
</style>
