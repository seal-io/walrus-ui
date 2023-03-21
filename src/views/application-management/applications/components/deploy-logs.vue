<template>
  <div class="logs-wrap">
    <span class="close-btn" @click="handleClose">
      <icon-close class="size-20" />
    </span>
    <div class="tips">
      <slot name="header">{{ title }}... </slot>
    </div>
    <a-textarea
      v-model="content"
      class="log-text"
      disabled
      readonly
      :auto-size="{ minRows: 10, maxRows: 20 }"
    ></a-textarea>
    <div class="tips">
      <slot>点击右上角按钮可关闭</slot>
    </div>
    <!-- <AceEditor :model-value="val" read-only></AceEditor> -->
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
        return '部署实例';
      }
    }
  });
  const emits = defineEmits(['close']);
  const wssInstance: any = ref('');
  const content = ref('');
  const val = ref('');
  const createWebSockerConnection = () => {
    if (!props.revisionId) return;
    const wssURL = createWebSocketUrl(
      `application-revisions/${props.revisionId}/log`
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
  onMounted(() => {
    init();
  });
  watch(
    () => wssInstance.value?.data,
    (newVal) => {
      if (newVal) {
        content.value = `${content.value}${newVal}`;
        console.log('message:', newVal);
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.revisionId,
    () => {
      init();
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
    position: relative;
    margin-bottom: 20px;
    background-color: #1c1c1c;
    border-radius: var(--border-radius-small);

    .tips {
      padding: 5px;
      color: #fff;
      text-align: left;
    }

    cursor: auto;

    .log-text {
      color: #fff;
      background-color: #1c1c1c;
      cursor: auto;

      &:hover {
        background-color: #1c1c1c;
      }
    }

    .close-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 100;
      color: #fff;
      cursor: pointer;
    }
  }
</style>
