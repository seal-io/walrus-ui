<template>
  <div class="view-item-box">
    <div class="seal-view-item-wrap" :class="{ 'has-append': slots.append }">
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
      <div class="s-v-t"><slot></slot></div>
    </div>
    <span v-if="slots?.append" class="arco-input-append">
      <slot name="append"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { useSlots } from 'vue';

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

  const slots = useSlots();
</script>

<script lang="ts">
  export default {
    name: 'SealViewItemWrap'
  };
</script>

<style lang="less" scoped>
  @height: 54px;

  .view-item-box {
    display: flex;
    align-items: center;
    width: 100%;

    .arco-input-append {
      height: @height;
      padding: 0 12px;
      border: 1px solid var(--color-border-2);
      border-left: none;
      border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0;
    }
  }

  .seal-view-item-wrap {
    flex: 1;
    min-height: @height;
    padding: 8px 12px;
    padding-bottom: 0;
    line-height: 1;
    word-break: break-word;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    &.has-append {
      border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);
    }

    .label {
      display: flex;
      align-items: center;
      width: fit-content;
      margin-bottom: 0;
      color: var(--color-text-3);
      font-weight: var(--font-weight-medium);
      font-size: 12px;
    }

    .s-v-t {
      max-height: 140px;
      padding: 4px 0;
      overflow: auto;
      font-size: var(--font-size-small);
      line-height: 2;
    }
  }
</style>
