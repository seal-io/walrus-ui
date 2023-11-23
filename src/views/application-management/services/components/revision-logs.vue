<template>
  <div class="logs-wrap">
    <div ref="scroller" class="log-text" :class="{ fullscreen: fullscreen }">
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { ref, inject, watch } from 'vue';
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
  let axiosToken: any = null;
  const { setChunkRequest } = useSetChunkRequest();

  const updateScrollerPosition = () => {
    const scrollerContainer = scroller.value || {};
    const { scrollHeight, clientHeight, scrollTop } = scrollerContainer;
    if (scrollHeight > clientHeight + scrollTop) {
      scroller.value.scrollTop += 5;
      window.requestAnimationFrame(updateScrollerPosition);
    }
  };

  const updateContent = (newVal) => {
    content.value = `${newVal}`;
    window.requestAnimationFrame(updateScrollerPosition);
  };

  const createWebSockerConnection = () => {
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
  const handleClose = () => {
    emits('close');
  };

  const init = () => {
    content.value = '';
    createWebSockerConnection();
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

      &.fullscreen {
        max-height: calc(100vh - 254px);
      }
    }
  }
</style>
