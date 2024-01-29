<template>
  <div class="logs-wrap">
    <div
      ref="scroller"
      class="log-text"
      :class="{ fullscreen: fullscreen }"
      @wheel="handleContentWheel"
    >
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import {
    ref,
    inject,
    watch,
    onBeforeUnmount,
    onMounted,
    nextTick
  } from 'vue';
  import {
    SERVICE_API_PREFIX,
    SERVICE_API
  } from '@/views/application-management/services/api';
  import { ServiceStatus, ProvideServiceInfoKey } from '../config';

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
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  });
  const currentServiceInfo = inject(ProvideServiceInfoKey, ref<any>({}));
  const emits = defineEmits(['close']);
  const content = ref('');
  const scroller = ref();
  const isWheeled = ref(false);
  let axiosToken: any = null;
  const { setChunkRequest } = useSetChunkRequest();

  const handleContentWheel = (e) => {
    isWheeled.value = true;
  };

  const updateScrollerPosition = () => {
    const scrollerContainer = scroller.value || {};
    const { scrollHeight, clientHeight, scrollTop } = scrollerContainer;
    if (!isWheeled.value && scrollHeight > clientHeight + scrollTop) {
      scroller.value.scrollTop += 5;
      window.requestAnimationFrame(updateScrollerPosition);
    }
  };

  const updateContent = (newVal) => {
    content.value = `${newVal}`;
    if (!isWheeled.value) {
      window.requestAnimationFrame(updateScrollerPosition);
    }
  };

  const createWebSocketConnection = () => {
    if (!props.revisionId) return;
    axiosToken?.cancel?.();
    const jobType =
      currentServiceInfo.value.status?.summaryStatus === ServiceStatus.Deleting
        ? 'destroy'
        : 'apply';
    axiosToken = setChunkRequest({
      url: `${SERVICE_API_PREFIX()}${SERVICE_API}/${
        currentServiceInfo.value.id
      }/revisions/${props.revisionId}/log`,
      params: {
        jobType
      },
      contentType: 'text',
      handler: updateContent
    });
  };

  const init = () => {
    content.value = '';
    createWebSocketConnection();
  };
  watch(
    () => props.show,
    (val) => {
      if (val && props.revisionId) {
        init();
      } else if (!val) {
        content.value = '';
        axiosToken?.cancel?.();
      }
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    axiosToken?.cancel?.();
  });
</script>

<style lang="less" scoped>
  .logs-wrap {
    .log-text {
      min-height: 200px;
      max-height: 360px;
      padding: 0 10px;
      overflow-y: auto;
      color: var(--color-logs-text);
      white-space: pre-wrap;
      background-color: var(--color-logs-bg);
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);

      &.fullscreen {
        max-height: calc(100vh - 270px);
      }
    }
  }
</style>
