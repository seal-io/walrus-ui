<template>
  <a-spin
    style="width: 100%; font-size: 0"
    :loading="attrs.loading"
    :class="{ 'top-gap': topGap }"
  >
    <a-card
      :title="title"
      :class="{ 'header-border-less': borderless }"
      :body-style="{ padding: padding, ...bodyStyle }"
      :bordered="bordered"
    >
      <template v-if="title" #title>
        <slot name="title">{{ title }}</slot>
      </template>
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
        return '16px';
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    bordered: {
      type: Boolean,
      default() {
        return false;
      }
    },
    borderless: {
      type: Boolean,
      default() {
        return false;
      }
    },
    topGap: {
      type: Boolean,
      default() {
        return false;
      }
    },
    bodyStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    contentStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const attrs: any = useAttrs();
</script>

<style lang="less" scoped>
  @paddingSize: 16px;

  .top-gap {
    margin-top: 10px;
  }

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
      padding: @paddingSize @paddingSize 0;
      overflow: visible;
      border: none;

      .arco-card-header-title {
        overflow: visible;
        font-weight: 400;
        line-height: 1;
      }
    }
  }
</style>
