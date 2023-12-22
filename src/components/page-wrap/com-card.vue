<template>
  <div class="com-card" :class="{ 'top-gap': topGap }">
    <a-card
      :title="title"
      v-bind="attrs"
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
  </div>
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';

  defineProps({
    padding: {
      type: String,
      default() {
        return '20px 20px 16px';
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
    },
    topGap: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const attrs = useAttrs();
</script>

<style lang="less" scoped>
  @paddingSize: 16px;

  .spin-card-content {
    // background: var(--color-fill-1);
    // border-radius:  var(--border-radius-small);;
  }

  .com-card {
    :deep(.arco-card) {
      overflow: hidden;
      border-radius: var(--border-radius-small);
    }

    &.top-gap {
      margin-top: 10px;
    }
  }

  :deep(.arco-card-header) {
    height: auto;
    padding: @paddingSize @paddingSize 0;
    overflow: visible;
    border: none;

    .arco-card-header-title {
      overflow: visible;
      // font-weight: 400;
      line-height: 1;
    }
  }
</style>
