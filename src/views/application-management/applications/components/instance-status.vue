<template>
  <span class="label-wrapper">
    <span style="display: inline">
      <span class="dot" :class="[statusMap[status] || status]"></span>
      <slot name="label"
        ><span>{{ label }}</span></slot
      >
    </span>
  </span>
</template>

<script lang="ts" setup>
  defineProps({
    status: {
      type: String,
      default() {
        return 'running';
      }
    },
    label: {
      type: String,
      default() {
        return '';
      }
    },
    statusMap: {
      type: Object, // {running: string, warning: string, error: string}
      default() {
        return {};
      }
    }
  });
</script>

<style lang="less" scoped>
  .label-wrapper {
    padding: 2px;
    background-color: var(--seal-color-bg);
    border-radius: 2px;

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
      border-radius: 50%;

      &.running {
        background-color: var(--seal-color-success);
      }

      &.warning {
        background-color: var(--seal-color-warning);
      }

      &.error {
        background-color: var(--seal-color-error);
      }
    }
  }
</style>
