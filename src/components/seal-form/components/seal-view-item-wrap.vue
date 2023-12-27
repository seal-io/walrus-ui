<template>
  <div class="seal-view-item-wrap">
    <div class="label">
      <span
        ><span>{{ label }}</span>
        <span
          v-if="required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        ></span
      >
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle
          style="stroke-linecap: initial; cursor: default"
          class="m-l-2"
        />
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
    showRequiredMark: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    popupInfo: {
      type: String,
      default: ''
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'SealViewItemWrap'
  };
</script>

<style lang="less" scoped>
  @height: 52px;

  .seal-view-item-wrap {
    position: relative;
    display: flex;
    align-items: center;
    min-height: @height;
    padding: 0 12px;
    padding-top: 20px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .label {
      position: absolute;
      top: 6px;
      left: 12px;
      display: flex;
      align-items: center;
      color: var(--color-text-3);
      font-weight: var(--font-weight-medium);
      font-size: 12px;
    }
  }
</style>
