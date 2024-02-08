<template>
  <a-modal
    :top="fullscreen ? 0 : '10%'"
    :closable="true"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      height: fullscreen ? 'auto' : '560px',
      overflow: 'auto'
    }"
    modal-class="project-modal"
    :title="title"
    :footer="false"
    :fullscreen="fullscreen"
    unmount-on-close
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <template #title>
      <div class="relative flex-1 align-center">
        <a-link
          class="icon iconfont full-btn size-16 absolute"
          :class="{
            'icon-fullscreen': !fullscreen,
            'icon-fullscreen-exit': fullscreen
          }"
          style="left: 0"
          @click="handleToggleFullScreen"
        ></a-link>
        <span>{{ title }}</span>
      </div>
    </template>
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <div>
        <BasicData
          :run-data="basicData"
          class="m-b-10"
          @apply="handleApplyResourceRun"
        >
        </BasicData>
        <a-tabs
          v-model:active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          :bordered="false"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            key="components"
            :title="$t('resource.revisons.detail.components')"
          >
            <runComponents :run-data="basicData"></runComponents>
          </a-tab-pane>
          <a-tab-pane
            key="attributes"
            :title="$t('resource.revisons.detail.attributes')"
          >
            <runAttributes :run-data="basicData"></runAttributes>
          </a-tab-pane>
          <a-tab-pane key="logs" :title="$t('applications.instance.tab.log')">
            <runLogs
              :show="show"
              :run-data="basicData"
              :fullscreen="fullscreen"
            ></runLogs>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import { ref, PropType, watch, nextTick } from 'vue';
  import { websocketEventType } from '@/views/config';
  import {
    applyResourceRun,
    queryServiceRevisionsDetail,
    getResourceDetailsAPIPrefix
  } from '@/views/application-management/services/api';
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
  const activeKey = ref('logs');
  const fullscreen = ref(false);
  let axiosChunkToken: any = null;
  let axiosRunDetailToken: any = null;

  const handleOk = () => {
    emit('save');
  };
  const handleCancel = () => {
    emit('update:show', false);
    emit('save');
  };

  const handleToggleFullScreen = () => {
    fullscreen.value = !fullscreen.value;
  };
  const getResoureceRunDetail = async () => {
    axiosRunDetailToken?.cancel();
    axiosRunDetailToken = createAxiosToken();
    try {
      loading.value = true;
      const params = {
        id: props.data.runId,
        serviceID: props.data.serviceId
      };
      const { data } = await queryServiceRevisionsDetail(
        params,
        axiosRunDetailToken.token
      );
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

  const handleApplyResourceRun = async (approve) => {
    try {
      const params = {
        id: props.data.runId,
        serviceID: props.data.serviceId,
        data: {
          approve
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
    axiosRunDetailToken?.cancel();
    basicData.value = {};
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
