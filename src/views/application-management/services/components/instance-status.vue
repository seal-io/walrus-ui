<template>
  <span class="label-wrapper">
    <span class="status">
      <span class="dot" :class="[get(statusMap, status) || status]"></span>
      <slot name="label"
        ><span>{{ label }}</span></slot
      >
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';

  const props = defineProps({
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
    },
    serviceId: {
      type: String,
      default() {
        return '';
      }
    },
    applicationId: {
      type: String,
      default() {
        return '';
      }
    },
    projectId: {
      type: String,
      default() {
        return '';
      }
    }
  });
</script>

<style lang="less" scoped>
  .label-wrapper {
    display: flex;
    padding: 2px;

    .status {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

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
