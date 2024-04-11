<template>
  <span class="status-label">
    <span v-if="statusInfo.status">
      <span v-if="showLoading" class="loading">
        <span v-if="statusInfo.transitioning">
          <a-progress
            class="arco-icon-loading progress"
            size="mini"
            status="normal"
            :color="color.text"
            :width="16"
            :stroke-width="3"
            :percent="0.6"
          />
          <span class="text" :style="{ color: color.text }">{{
            statusInfo.text
          }}</span>
        </span>
        <span v-else-if="statusInfo.error">
          <i
            class="size-16 icon-warning-filling-copy iconfont"
            :style="{ color: color.text }"
          ></i>
        </span>
        <span v-else>
          <icon-check-circle-fill
            class="size-16"
            :style="{ color: color.text }"
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
    phase: string;
    phaseMessage: string;
    phaseIsError?: boolean;
    phaseIsWarning?: boolean;
    phaseIsTransitioning?: boolean;
    phaseIsInactive?: boolean;
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
      status: props.status.phase,
      text: props.status.phase,
      message: props.status.phaseMessage,
      error: props.status.phaseIsError,
      transitioning: props.status.phaseIsTransitioning,
      warning: props.status.phaseIsWarning,
      inactive: props.status.phaseIsInactive
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
