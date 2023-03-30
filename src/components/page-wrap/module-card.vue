<template>
  <div class="module-card-wrap">
    <div class="title">
      <icon-tag v-if="showIcon" />
      <slot name="title"
        ><span>{{ title }}</span></slot
      >
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default() {
        return '';
      }
    },
    showIcon: {
      type: Boolean,
      default() {
        return true;
      }
    }
  });
</script>

<style lang="less" scoped>
  .module-card-wrap {
    .title {
      display: flex;
      align-items: center;
      margin-top: @title-top-gap;
      margin-bottom: @title-bottom-gap;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 14px;

      :deep(.arco-icon) {
        margin-right: 2px;
        font-size: 13px;
      }
    }
  }
</style>
