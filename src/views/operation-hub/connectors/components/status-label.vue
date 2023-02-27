<template>
  <span class="status-label">
    <span class="label">
      <span v-if="status !== 'error'" class="dot" :class="[status]"></span>
      <icon-font
        v-if="status === 'error'"
        class="size-16"
        style="margin-right: 5px"
        type="icon-warning-filling"
      ></icon-font>
      <span class="text">
        {{ status }}
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  defineProps({
    status: {
      type: String,
      default() {
        return 'unconnected';
      }
    },
    label: {
      type: String,
      default() {
        return '';
      }
    }
  });
</script>

<style lang="less" scoped>
  .status-label {
    .label {
      display: inline-flex;
      align-items: center;
    }

    .dot {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 6px;
      border-radius: 8px;

      &.ready {
        background-color: rgba(var(--seal-color-success-1), 0.7);
      }

      &.unconnected {
        background-color: var(--color-text-4);
      }

      &.initializing {
        background-color: rgba(var(--arcoblue-5), 0.7);
      }
    }
  }
</style>
