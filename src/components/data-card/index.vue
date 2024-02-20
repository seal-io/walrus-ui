<template>
  <div class="data-card-wrap" :style="{ background: bgColor }">
    <a-statistic v-bind="attrs">
      <template v-for="k in Object.keys(slots)" :key="k" #[k]>
        <slot :name="k"></slot>
      </template>
    </a-statistic>
  </div>
</template>

<script lang="ts" setup>
  import { useAttrs, useSlots } from 'vue';

  defineProps({
    bgColor: {
      type: String,
      default() {
        return 'var(--color-white)';
      }
    }
  });
  const attrs = useAttrs();
  const slots = useSlots();
</script>

<script lang="ts">
  export default {
    name: 'DataCard',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  .data-card-wrap {
    padding: 10px;
    text-align: center;
    border-radius: var(--border-radius-small);
    box-shadow: var(--color-data-card-shadow);

    :deep(.arco-statistic-title) {
      font-size: var(--font-size-large);
    }

    :deep(.arco-statistic-extra) {
      margin-top: 0;
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-large);
    }
  }
</style>
