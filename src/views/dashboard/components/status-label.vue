<template>
  <span class="status-label">
    <span class="label">
      <span class="dot" :style="{ backgroundColor: color }"></span>
      <span class="text">{{ status }}</span>
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
    color: {
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
      width: 10px;
      height: 10px;
      margin-right: 6px;
      border-radius: 7px;

      &.ready {
        background-color: rgba(var(--seal-color-success-1), 0.7);
      }

      &.unconnected {
        background-color: var(--color-text-4);
      }
    }
  }
</style>
