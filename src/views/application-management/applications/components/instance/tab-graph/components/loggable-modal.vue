<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    unmount-on-close
    :body-style="{
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="res-loggable-modal"
    title="日志"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div class="tab-logs-wrap">
      <div class="wrap">
        <div class="content">
          <div v-html="content"></div>
        </div>
      </div>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #cancel>
          <a-button
            :type="'primary'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import Convert from 'ansi-to-html';
  import { get, split } from 'lodash';
  import hasAnsi from 'has-ansi';
  import {
    ref,
    PropType,
    onBeforeUnmount,
    onMounted,
    defineExpose,
    watch
  } from 'vue';
  import { getPermissionRouteParams } from '../../../../api';

  const props = defineProps({
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object as PropType<{ id: string; key: string }>,
      default() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['update:show']);
  const { setChunkRequest } = useSetChunkRequest();
  const content = ref('');
  const convert = new Convert();
  let chunRequestIns: any = null;

  const updateContent = (newVal) => {
    if (hasAnsi(newVal)) {
      // content.value = `${content.value}${convert.toHtml(newVal)}`;
      content.value = `${convert.toHtml(newVal)}`;
    } else {
      // content.value = `${content.value}${newVal}`;
      content.value = `${newVal}`;
    }
  };
  const createChunkConnection = async () => {
    if (!props.info.key || !props.info.id) return;
    const url = `/application-resources/${props.info.id}/log`;
    chunRequestIns = setChunkRequest({
      url,
      params: {
        key: props.info.key,
        watch: true,
        ...getPermissionRouteParams()
      },
      contentType: 'text',
      handler: updateContent
    });
  };

  const init = () => {
    content.value = '';
    chunRequestIns?.cancel?.();
    createChunkConnection();
  };
  const resetData = () => {
    console.log('reset');
    content.value = '';
    chunRequestIns?.cancel();
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    resetData();
  };
</script>

<style lang="less" scoped>
  .res-loggable-modal {
    .tab-logs-wrap {
      .wrap {
        height: 460px;
        padding: 5px 0 5px 10px;
        overflow: hidden;
        white-space: pre;
        text-align: left;
        background-color: var(--color-fill-2);
        border-radius: var(--border-radius-small);

        .content {
          height: 450px;
          overflow: auto;
          font-size: 14px;
          line-height: 22px;
          white-space: pre-wrap;
          background-color: var(--color-fill-2);
        }
      }
    }
  }
</style>
