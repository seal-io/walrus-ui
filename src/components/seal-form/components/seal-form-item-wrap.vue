<template>
  <div class="seal-form-item-wrap">
    <div class="label">
      <span>{{ label }}</span>
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle style="stroke-linecap: initial; cursor: default" />
      </a-tooltip>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    label: {
      type: String,
      default: ''
    },
    popupInfo: {
      type: String,
      default: ''
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'SealFormItemWrap'
  };
</script>

<style lang="less" scoped>
  .seal-form-item-wrap {
    padding: 10px 12px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: var(--color-text-3);
      font-weight: 400;
      font-size: 12px;
    }
  }
</style>
