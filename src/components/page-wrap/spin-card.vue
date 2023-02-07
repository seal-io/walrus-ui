<template>
  <a-spin style="width: 100%; font-size: 0" :loading="attrs.loading">
    <a-card
      :title="title"
      :class="{ 'header-border-less': borderless }"
      :body-style="{ padding: padding, ...bodyStyle }"
      :bordered="bordered"
    >
      <div :style="contentStyle" class="spin-card-content">
        <slot></slot>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';

  defineProps({
    padding: {
      type: String,
      default() {
        return '20px 20px 20px 20px';
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
    borderless: {
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
  const attrs: any = useAttrs();
</script>

<style lang="less" scoped>
  .spin-card-content {
    // background: var(--color-fill-1);
    // border-radius: 4px;
  }

  :deep(.arco-card) {
    border-radius: 4px;
  }

  .header-border-less {
    :deep(.arco-card-header) {
      height: auto;
      padding: 16px 20px 0;
      border: none;

      .arco-card-header-title {
        font-weight: 400;
      }
    }
  }
</style>
