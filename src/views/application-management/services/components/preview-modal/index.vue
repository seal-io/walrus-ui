<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="800"
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
    <div :loading="loading" style="width: 100%; text-align: center">
      <div>
        <BasicData
          :data-info="basicData"
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
            <runComponents></runComponents>
          </a-tab-pane>
          <a-tab-pane key="attributes" title="Attributes">
            <runAttributes></runAttributes>
          </a-tab-pane>
          <a-tab-pane key="logs" title="Logs">
            <runLogs></runLogs>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, PropType } from 'vue';
  import { applyResourceRun, queryServiceRevisionsDetail } from '../../api';
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
    serviceId: {
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
    data: {
      type: Object as PropType<{ serviceId: string; runId: string }>,
      default() {
        return {};
      }
    }
  });
  const basicData = ref({
    id: '12312',
    changes: {
      add: 2,
      delete: 1,
      change: 3
    },
    createdBy: 'admin',
    duration: 123,
    changeComment: 'test',
    status: {
      summaryStatus: 'Ready'
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const loading = ref(false);
  const activeKey = ref('components');

  const handleOk = () => {
    emit('save');
  };
  const handleCancel = () => {
    emit('update:show', false);
  };

  const getResoureceRunDetail = async () => {};
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
  const handleTabChange = () => {};
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
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
