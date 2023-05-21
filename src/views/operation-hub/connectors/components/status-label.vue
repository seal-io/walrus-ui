<template>
  <div class="status-label">
    <div v-if="status.status">
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
      <a-tag
        v-else
        :color="color"
        :style="{ height: `${size}px`, minWidth: `${size}px` }"
      >
        <span v-if="status.error || status.transitioning"
          ><a-tooltip v-if="status.message" :content="status.message">
            <icon-exclamation-circle-fill
              style="margin-right: 4px; color: #fff"
            /> </a-tooltip
        ></span>
        <span>{{ status.text }}</span>
      </a-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';

  interface StatusType {
    status: string;
    text?: string;
    message: string;
    error?: boolean;
    transitioning?: boolean;
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
    if (props.status.error) {
      return '#f53f3f';
    }
    if (props.status.transitioning) {
      return '#f7ba1e';
    }
    return '#00bf72';
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
    display: inline-flex;
    align-items: center;
    font-size: 0;

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

    :deep(.arco-tag) {
      box-sizing: border-box;
      padding: 0 5px;
      // min-width: 20px;
      // height: 20px;
      border-radius: 12px;
    }
  }
</style>
