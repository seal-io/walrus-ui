<template>
  <div class="logs-wrap">
    <div ref="scroller" class="log-text">
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
  import { AppInstanceStatus } from '../config';
  // import AceEditor from '@/components/ace-editor/index.vue';

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
        return '';
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const instanceInfo = inject(
    'instanceInfo',
    ref({
      status: ''
    })
  );
  const emits = defineEmits(['close']);
  const wssInstance: any = ref('');
  const content = ref('');
  const scroller = ref();
  const createWebSockerConnection = () => {
    if (!props.revisionId) return;
    console.log('instanceInfo===', instanceInfo.value);
    const jobType =
      instanceInfo.value.status === AppInstanceStatus.Deleting
        ? 'destroy'
        : 'apply';
    const wssURL = createWebSocketUrl(
      `/application-revisions/${props.revisionId}/log?jobType=${jobType}`
    );
    wssInstance.value = useWebSocket(wssURL, {
      autoReconnect: false
    });
  };
  const handleClose = () => {
    emits('close');
  };
  const updateScrollerPosition = () => {
    const scrollerContainer = scroller.value || {};
    const { scrollHeight, clientHeight, scrollTop } = scrollerContainer;
    console.log('scroller===1===', scrollHeight, clientHeight, scrollTop);
    if (scrollHeight > clientHeight + scrollTop) {
      scroller.value.scrollTop += 1;
      // scroller.value.scrollTop = scrollHeight - clientHeight;
      window.requestAnimationFrame(updateScrollerPosition);
    }
  };
  const updateContent = (newVal) => {
    content.value = `${content.value}${newVal}`;
    window.requestAnimationFrame(updateScrollerPosition);
  };
  const init = () => {
    content.value = '';
    createWebSockerConnection();
  };
  watch(
    () => wssInstance.value?.data,
    (newVal) => {
      if (newVal) {
        updateContent(newVal);
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
