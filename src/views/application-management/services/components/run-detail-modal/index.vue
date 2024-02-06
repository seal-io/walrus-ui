<template>
  <a-modal
    top="10%"
    :closable="true"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="title"
    :footer="false"
    :fullscreen="false"
    unmount-on-close
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <div>
        <BasicData
          :run-data="basicData"
          class="m-b-10"
          @click="handleApplyResourceRun"
        >
        </BasicData>
        <a-tabs
          v-model:active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane key="components" title="Components">
            <runComponents :run-data="basicData"></runComponents>
          </a-tab-pane>
          <a-tab-pane key="attributes" title="Attributes">
            <runAttributes :run-data="basicData"></runAttributes>
          </a-tab-pane>
          <a-tab-pane key="logs" title="Logs">
            <runLogs :show="show" :run-data="basicData"></runLogs>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { ref, PropType, watch, nextTick } from 'vue';
  import { websocketEventType } from '@/views/config';
  import {
    applyResourceRun,
    queryServiceRevisionsDetail,
    getResourceDetailsAPIPrefix
  } from '../../api';
  import BasicData from './basic-data.vue';
  import runAttributes from './run-attributes.vue';
  import runComponents from './run-components.vue';
  import runLogs from './run-logs.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    data: {
      type: Object as PropType<{
        serviceId: string;
        runId: string;
        projectId: string;
        environmentId: string;
      }>,
      default() {
        return {};
      }
    }
  });
  const { setChunkRequest } = useSetChunkRequest();
  const basicData = ref<any>({});
  const emit = defineEmits(['save', 'update:show', 'update:data']);
  const loading = ref(false);
  const activeKey = ref('components');
  let axiosChunkToken: any = null;

  const handleOk = () => {
    emit('save');
  };
  const handleCancel = () => {
    emit('update:show', false);
  };

  const getResoureceRunDetail = async () => {
    try {
      loading.value = true;
      const params = {
        id: props.data.runId,
        serviceID: props.data.serviceId
      };
      const { data } = await queryServiceRevisionsDetail(params);
      basicData.value = data;
    } catch (error) {
      // handle error
      basicData.value = {};
    } finally {
      loading.value = false;
    }
  };

  const updateRevisions = (data) => {
    if (data?.type !== websocketEventType.UPDATE) return;
    const collections = _.filter(
      data.collection || [],
      (sItem) => sItem?.resource?.id === props.data.serviceId
    );
    // const collections = data?.collection || [];
    basicData.value = _.find(
      collections,
      (item) => item.id === props.data.runId
    );
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateRevisions(data);
    });
  };

  const handleApplyResourceRun = async (approval) => {
    try {
      const params = {
        id: props.data.runId,
        serviceID: props.data.serviceId,
        data: {
          approval
        }
      };
      await applyResourceRun(params);
      emit('save');
      setTimeout(() => {
        emit('update:show', false);
      }, 100);
    } catch (error) {
      // handle error
    }
  };

  const createServiceRevisionChunkRequest = () => {
    axiosChunkToken?.cancel();
    const url = getResourceDetailsAPIPrefix({
      projectID: props.data.projectId,
      serviceID: props.data.serviceId,
      environmentID: props.data.environmentId
    });
    try {
      axiosChunkToken = setChunkRequest({
        url: `${url}/runs`,
        handler: updateHandler
      });
    } catch (error) {
      //
    }
  };
  const init = async () => {
    if (!props.data.runId) return;
    await getResoureceRunDetail();
    nextTick(() => {
      createServiceRevisionChunkRequest();
    });
  };

  const handleTabChange = () => {};
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    axiosChunkToken?.cancel();
  };
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>
