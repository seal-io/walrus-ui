<template>
  <span class="status-label">
    <span v-if="statusInfo.status">
      <span v-if="showLoading" class="loading">
        <span v-if="statusInfo.transitioning">
          <a-progress
            class="arco-icon-loading progress"
            size="mini"
            status="warning"
            :color="StatusColor.warning.text"
            :width="14"
            :stroke-width="3"
            :percent="0.2"
          />
          <span class="text" :style="{ color: StatusColor.warning.text }">{{
            statusInfo.status
          }}</span>
        </span>
        <span v-else-if="statusInfo.error">
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
        :class="{ bordered }"
        :data-color="color"
        :style="{
          color: color.text,
          border: bordered ? `1px solid ${color.text}` : 'none',
          backgroundColor: !bordered ? color.bg : 'none'
        }"
      >
        <span v-if="statusInfo.error || statusInfo.transitioning" class="flex">
          <a-tooltip v-if="statusInfo.message" :content="statusInfo.message">
            <icon-info-circle-fill class="m-r-4" />
          </a-tooltip>
        </span>
        <span>{{ statusInfo.text }}</span>
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { PropType, computed, ref } from 'vue';
  import { StatusColor } from '@/views/config';

  interface StatusType {
    status: string;
    text?: string;
    message: string;
    error?: boolean;
    transitioning?: boolean;
    warning?: boolean;
    inactive?: boolean;
  }
  interface SummaryStatus {
    summaryStatus: string;
    summaryStatusMessage: string;
    error?: boolean;
    transitioning?: boolean;
    warning?: boolean;
    inactive?: boolean;
  }

  const props = defineProps({
    showLoading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    bordered: {
      type: Boolean,
      default() {
        return false;
      }
    },
    statusDetail: {
      type: Object as PropType<StatusType>,
      default() {
        return null;
      }
    },
    status: {
      type: Object as PropType<SummaryStatus>,
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

  const statusInfo = computed(() => {
    if (props.statusDetail) {
      return props.statusDetail;
    }

    return {
      status: props.status.summaryStatus,
      text: props.status.summaryStatus,
      message: props.status.summaryStatusMessage,
      error: props.status.error,
      transitioning: props.status.transitioning,
      warning: props.status.warning,
      inactive: props.status.inactive
    };
  });

  const color = computed(() => {
    if (statusInfo.value.inactive) {
      return StatusColor.inactive;
    }
    if (statusInfo.value.error) {
      return StatusColor.error;
    }
    if (statusInfo.value.transitioning) {
      return StatusColor.transitioning;
    }
    if (statusInfo.value.warning) {
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
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-small);
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
        font-size: 12px;
        transform: scale(0.9);
        animation: lighting 1.5s infinite cubic-bezier(0, 0, 1, 1);
      }
    }

    .arco-icon-loading.progress {
      animation: arco-loading-circle 1.5s infinite cubic-bezier(0, 0, 1, 1);
    }
  }
</style>
