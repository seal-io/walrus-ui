<template>
  <span class="label-wrapper">
    <a-link href="#" target="_blank" style="display: inline">
      <slot name="label"
        ><span>{{ label }}</span></slot
      >
      <template #icon>
        <span class="dot" :class="[status]"></span>
      </template>
    </a-link>
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
