<template>
  <span class="status-label">
    <span v-if="status.status">
      <a-tag
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
    </span>
  </span>
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
  .status-label {
    font-size: 0;

    :deep(.arco-tag) {
      box-sizing: border-box;
      padding: 0 5px;
      // min-width: 20px;
      // height: 20px;
      border-radius: 12px;
    }
  }
</style>
