<template>
  <div class="item-wrap-box">
    <div
      class="seal-form-item-wrap"
      :class="{ 'has-append': slots.append }"
      style="width: 100%"
    >
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
        <Tooltip :popup-info="popupInfo" :doc="doc"></Tooltip>
      </div>
      <slot></slot>
    </div>
    <span v-if="slots?.append" class="arco-input-append">
      <slot name="append"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { useSlots } from 'vue';
  import Tooltip from '../_components/tooltip.vue';

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
    },
    doc: {
      type: Object,
      default() {
        return null;
      }
    }
  });
  const slots = useSlots();
</script>

<script lang="ts">
  export default {
    name: 'SealFormItemWrap'
  };
</script>

<style lang="less" scoped>
  @height: 54px;

  .item-wrap-box {
    display: flex;
    align-items: center;

    .arco-input-append {
      height: @height;
      padding: 0 12px;
      border: 1px solid var(--color-border-2);
      border-left: none;
      border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0;
    }
  }

  .seal-form-item-wrap {
    flex: 1;
    min-height: @height;
    padding: 8px 12px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    &.has-append {
      border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);
    }

    .label {
      display: flex;
      align-items: center;
      width: fit-content;
      margin-bottom: 10px;
      color: var(--color-text-3);
      font-weight: var(--font-weight-medium);
      font-size: 12px;
    }
  }
</style>
