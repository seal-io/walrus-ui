<template>
  <div class="module-card-wrap">
    <div class="title" :class="{ iconed: showIcon }">
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
      font-size: 14px;

      &.iconed {
        margin-top: 25px;
        padding-bottom: 10px;
        padding-left: 10px;
      }

      &.iconed::before {
        position: absolute;
        top: -2px;
        bottom: 8px;
        left: 0;
        display: inline-block;
        width: 4px;
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
