<template>
  <div class="logs-wrap">
    <div
      ref="scroller"
      class="log-text"
      :class="{ fullscreen: fullscreen }"
      :style="{ maxHeight: maxHeight }"
      @wheel="handleContentWheel"
    >
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { ref, inject, watch, onBeforeUnmount } from 'vue';
  import {
    SERVICE_API_PREFIX,
    SERVICE_API
  } from '@/views/application-management/services/api';
  import {
    RevisionStatus,
    RevisionTypes,
    ProvideServiceInfoKey
  } from '@/views/application-management/services/config';

  const props = defineProps({
    runData: {
      type: Object,
      default() {
        return {};
      }
    },
    maxHeight: {
      type: String,
      default() {
        return '360px';
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

  /**
   * jobType:
   * plan: planning,
   * destory(running): runType(stop, delete),
   * apply(running): runType(...)
   */
  const createWebSocketConnection = () => {
    if (!props.runData.id) return;
    axiosToken?.cancel?.();
    let jobType = '';

    if (props.runData.status?.summaryStatus === RevisionStatus.Planning) {
      jobType = 'plan';
    } else if (
      props.runData.status?.summaryStatus === RevisionStatus.Running &&
      [RevisionTypes.stop, RevisionTypes.delete].includes(props.runData.type)
    ) {
      jobType = 'destroy';
    } else if (props.runData.status?.summaryStatus === RevisionStatus.Running) {
      jobType = 'apply';
    }

    axiosToken = setChunkRequest({
      url: `${SERVICE_API_PREFIX()}${SERVICE_API}/${
        props.runData.resource?.id
      }/runs/${props.runData.id}/log`,
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
      if (val && props.runData.id) {
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
      padding: 0 10px;
      overflow-y: auto;
      color: #ddd;
      white-space: pre-wrap;
      background-color: #181d28;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);

      &.fullscreen {
        max-height: calc(100vh - 270px);
      }
    }
  }
</style>
