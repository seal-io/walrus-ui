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
        return '#fff';
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
    box-shadow: 0 0 6px rgba(229, 230, 235, 0.3);
  }
</style>
