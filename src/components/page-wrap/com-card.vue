<template>
  <div class="com-card">
    <a-card
      :title="title"
      v-bind="attrs"
      :body-style="{ padding: padding, ...bodyStyle }"
      :bordered="bordered"
    >
      <slot name="title"></slot>
      <div :style="contentStyle" class="spin-card-content">
        <slot></slot>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';

  defineProps({
    padding: {
      type: String,
      default() {
        return '12px 20px 20px 20px';
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    bordered: {
      type: Boolean,
      default() {
        return false;
      },
    },
    bodyStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    contentStyle: {
      type: Object,
      default() {
        return {};
      },
    },
  });

  const attrs = useAttrs();
</script>

<style lang="less" scoped>
  .spin-card-content {
    // background: var(--color-fill-1);
    // border-radius: 4px;
  }

  .com-card {
    :deep(.arco-card) {
      overflow: hidden;
      border-radius: 4px;
    }
  }

  :deep(.arco-card-header) {
    height: auto;
    padding: 20px 20px 0;
    border: none;
  }
</style>
