<template>
  <div class="edit-page-footer" :style="style">
    <a-space :size="size" fill :class="[align]">
      <slot name="save"></slot>
      <slot></slot>
      <slot name="cancel"></slot>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    size: {
      type: Number,
      default() {
        return 40;
      }
    },
    style: {
      type: Object,
      default() {
        return {};
      }
    },
    align: {
      type: String,
      default() {
        return 'center';
      }
    }
  });
</script>

<style lang="less" scoped>
  .edit-page-footer {
    width: 100%;
    margin-top: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    // border-top: 1px solid var(--seal-border-gray-2)
    :deep(.arco-space-fill) {
      justify-content: center;

      &.left {
        justify-content: flex-start;
      }

      &.right {
        justify-content: flex-end;
      }
    }
  }
</style>
