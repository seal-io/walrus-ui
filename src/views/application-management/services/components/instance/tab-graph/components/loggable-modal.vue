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
      'padding': '20px',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="res-loggable-modal"
    :title="`${$t('applications.instance.tab.log')}-${nodeInfo.name}/${
      nodeInfo.description
    }`"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div class="flex" style="margin-bottom: 10px">
      <a-select
        v-model="info.key"
        style="width: 300px"
        :options="dataList"
        @change="handleKeyChange"
      ></a-select>
    </div>
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
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import Convert from 'ansi-to-html';
  import hasAnsi from 'has-ansi';
  import { ref, PropType, reactive } from 'vue';
  import usePermissionParams from '@/views/application-management/hooks/use-permission-params';
  import { ResourceKey } from '../../../../config/interface';

  const props = defineProps({
    nodeInfo: {
      type: Object,
      default() {
        return '';
      }
    },
    dataList: {
      type: Object as PropType<ResourceKey[]>,
      default() {
        return [];
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
  const perissionParams = usePermissionParams();
  const { setChunkRequest } = useSetChunkRequest();
  const content = ref('');
  const convert = new Convert();
  const info = reactive({ key: '', id: '' });
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
    if (!info.key || !info.id) return;
    const url = `/service-resources/${info.id}/log`;
    chunRequestIns = setChunkRequest({
      url,
      params: {
        key: info.key,
        watch: true,
        ...perissionParams
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
  const handleKeyChange = (value) => {
    const data = _.find(props.dataList, (item) => item.value === value);
    info.key = data?.value || '';
    info.id = data?.id || '';
    init();
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
    const data = _.get(props.dataList, '0') || {};
    info.key = data?.value || '';
    info.id = data?.id || '';
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
