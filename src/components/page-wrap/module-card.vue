<template>
  <div class="module-card-wrap">
    <div class="title" :class="{ iconed: showIcon }" :style="{ ...titleStyle }">
      <!-- <icon-tag v-if="showIcon" /> -->
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
    },
    titleStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  });
</script>

<style lang="less" scoped>
  .module-card-wrap {
    .title {
      position: relative;
      display: flex;
      align-items: center;
      margin-top: @title-top-gap;
      margin-bottom: @title-bottom-gap;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 16px;

      &.iconed {
        margin-top: 30px;
        padding-bottom: 10px;
        padding-left: 8px;
      }

      &.iconed::before {
        position: absolute;
        top: 0;
        bottom: 10px;
        left: 0;
        display: inline-block;
        width: 3px;
        background-color: rgba(var(--arcoblue-6), 0.8);
        border-radius: 0 4px 4px 0;
        content: '';
      }

      :deep(.arco-icon) {
        margin-right: 2px;
        font-size: 13px;
      }
    }
  }
</style>
