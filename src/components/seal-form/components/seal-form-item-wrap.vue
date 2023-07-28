<template>
  <div class="seal-form-item-wrap">
    <div class="label">
      <span
        ><span>{{ label }}</span>
        <span
          v-if="$attrs.required"
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
      margin-bottom: 10px;
      color: var(--color-text-3);
      font-weight: 400;
      font-size: 12px;
    }
  }
</style>
