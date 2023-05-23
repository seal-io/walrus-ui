<template>
  <div class="logs-wrap">
    <div ref="scroller" class="log-text">
      {{ content }}
    </div>
    <!-- <AceEditor :model-value="content" read-only></AceEditor> -->
  </div>
</template>

<script lang="ts" setup>
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { ref, inject, watch } from 'vue';
  import { AppInstanceStatus } from '../config';
  import { getPermissionRouteParams } from '../api';
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
  const content = ref('');
  const scroller = ref();
  const { setChunkRequest } = useSetChunkRequest();

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
    // content.value = `${content.value}${newVal}`;
    content.value = `${newVal}`;
    window.requestAnimationFrame(updateScrollerPosition);
  };

  const createWebSockerConnection = () => {
    if (!props.revisionId) return;
    const jobType =
      instanceInfo.value.status === AppInstanceStatus.Deleting
        ? 'destroy'
        : 'apply';
    setChunkRequest({
      url: `/application-revisions/${props.revisionId}/log`,
      params: {
        jobType,
        ...getPermissionRouteParams()
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
    }
  }
</style>
