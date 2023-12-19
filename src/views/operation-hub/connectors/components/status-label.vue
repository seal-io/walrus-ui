<template>
  <span class="status-label">
    <span v-if="status.status">
      <span v-if="showLoading" class="loading">
        <span v-if="status.transitioning">
          <a-progress
            class="arco-icon-loading progress"
            size="mini"
            status="warning"
            color="var(--seal-color-warning)"
            :width="14"
            :stroke-width="3"
            :percent="0.2"
          />
          <span class="text">{{ status.status }}</span>
        </span>
        <span v-else-if="status.error">
          <icon-font
            type="icon-warning-filling-copy"
            class="size-16"
          ></icon-font>
        </span>
        <span v-else>
          <icon-check-circle-fill
            class="size-16"
            style="color: var(--seal-color-success)"
        /></span>
      </span>
      <span
        v-else
        class="tag"
        :style="{
          color: color.color5,
          backgroundColor: color.color1
        }"
      >
        <span v-if="status.error || status.transitioning" class="flex"
          ><a-tooltip v-if="status.message" :content="status.message">
            <i
              class="iconfont icon-ic-exclamation-circle"
              :style="{ 'margin-right': '4px', 'color': color.color6 }"
            ></i> </a-tooltip
        ></span>
        <span>{{ status.text }}</span>
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';
  import { StatusColor } from '@/views/config';

  interface StatusType {
    status: string;
    text?: string;
    message: string;
    error?: boolean;
    transitioning?: boolean;
    inactive?: boolean;
  }
  const props = defineProps({
    showLoading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    status: {
      type: Object as PropType<StatusType>,
      default() {
        return {};
      }
    },
    label: {
      type: String,
      default() {
        return '';
      }
    },
    zoom: {
      type: Number,
      default() {
        return 1;
      }
    },
    size: {
      type: Number,
      default() {
        return 20;
      }
    }
  });
  const color = computed(() => {
    if (props.status.inactive) {
      return StatusColor.inactive;
    }
    if (props.status.error) {
      return StatusColor.error;
    }
    if (props.status.transitioning) {
      return StatusColor.warning;
    }
    return StatusColor.success;
  });
</script>

<style lang="less" scoped>
  @keyframes lighting {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .status-label {
    display: flex;
    align-items: center;
    font-size: 0;

    .tag {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      font-weight: 400;
      font-size: var(--font-size-normal);
      line-height: 22px;
      border-radius: 22px;
    }

    .extra {
      font-size: 0;
    }

    .loading {
      display: flex;
      font-size: 12px;

      .text {
        margin-left: 4px;
        color: var(--seal-color-warning);
        font-size: 12px;
        transform: scale(0.9);
        // opacity: 0.7;
        animation: lighting 1.5s infinite cubic-bezier(0, 0, 1, 1);
      }
    }

    .arco-icon-loading.progress {
      animation: arco-loading-circle 1.5s infinite cubic-bezier(0, 0, 1, 1);
    }
  }
</style>
