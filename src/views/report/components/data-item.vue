<template>
  <div class="data-item-wrap">
    <a-space direction="vertical" align="center">
      <div class="data-label">{{ label }}</div>
      <div class="data-value"
        ><slot name="value">{{ value }}</slot></div
      >
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    label: {
      type: String,
      default() {
        return '';
      },
    },
    value: {
      type: [String, Number],
      default() {
        return '';
      },
    },
  });
</script>

<style lang="less" scoped>
  .data-item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px 20px;
    font-size: 14px;
    background-color: var(--color-fill-2);
    border-radius: 4px;

    .data-label {
      font-weight: 500;
    }

    .data-value {
      font-size: 12px;
    }
  }
</style>
