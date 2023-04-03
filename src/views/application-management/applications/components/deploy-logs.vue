<template>
  <div class="logs-wrap">
    <div class="log-text">
      {{ content }}
    </div>
    <!-- <AceEditor :model-value="content" read-only></AceEditor> -->
  </div>
</template>

<script lang="ts" setup>
  import { useWebSocket } from '@vueuse/core';
  import { createWebSocketUrl } from '@/hooks/use-websocket';
  import {
    onMounted,
    ref,
    inject,
    computed,
    onBeforeUnmount,
    watch,
    onUnmounted
  } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';

  const props = defineProps({
    revisionId: {
      type: String,
      default() {
        return '';
      }
    },
    title: {
      type: String,
      default() {
        return '日志';
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['close']);
  const wssInstance: any = ref('');
  const content = ref('');
  const createWebSockerConnection = () => {
    if (!props.revisionId) return;
    const wssURL = createWebSocketUrl(
      `/application-revisions/${props.revisionId}/log`
    );
    wssInstance.value = useWebSocket(wssURL, {
      // autoReconnect: {
      //   retries: 3,
      //   delay: 1000,
      //   onFailed() {
      //     console.log('Failed to connect WebSocket after 3 retries');
      //   }
      // }
      autoReconnect: false
    });
  };
  const handleClose = () => {
    emits('close');
  };
  const init = () => {
    content.value = '';
    createWebSockerConnection();

    console.log('object:', wssInstance.value, props.revisionId);
  };
  watch(
    () => wssInstance.value?.data,
    (newVal) => {
      if (newVal) {
        content.value = `${content.value}${newVal}`;
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.show,
    (val) => {
      if (val && props.revisionId) {
        init();
      } else if (!val) {
        wssInstance.value?.close?.();
        content.value = '';
      }
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    wssInstance.value?.close?.();
  });
</script>

<style lang="less" scoped>
  .logs-wrap {
    .log-text {
      min-height: 200px;
      max-height: 360px;
      padding: 0 10px;
      overflow-y: auto;
      white-space: pre-wrap;
      background-color: var(--color-fill-2);
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
    }
  }
</style>
