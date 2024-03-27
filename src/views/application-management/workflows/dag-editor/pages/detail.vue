<template>
  <div>
    <BreadWrapper>
      <Breadcrumb :menu="{ icon: 'icon-apps', label: 'DAG' }"></Breadcrumb>
      <template #right>
        <a-space fill :size="20" align="end" style="margin-right: 60px">
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.WorkflowExecutions,
                projectID,
                actions: [Actions.PUT]
              })
            "
            type="primary"
            @click="handleRetryAction"
          >
            {{ $t('common.button.retry') }}
          </a-button>
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.WorkflowExecutions,
                projectID,
                actions: [Actions.PUT]
              })
            "
            type="primary"
            status="warning"
            @click="handleStopAction"
          >
            {{ $t('workflow.button.stop') }}
          </a-button>
        </a-space>
      </template>
    </BreadWrapper>
    <ComCard>
      <DagEditor
        :action="pageAction"
        style="height: calc(100vh - 110px)"
        :dag-data="dagData"
      ></DagEditor>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import i18n from '@/locale';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { ref, onMounted, provide } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DagEditor from '../index.vue';
  import { queryWorkflowItem, retryWorkflow, stopWorkflow } from '../api';

  const { route, t } = useCallCommon();
  const userStore = useUserStore();
  const dagData = ref({});
  const nodesStatus = ref({});
  const projectID = route.params.projectID as string;
  const flowName = route.query.name as string;
  const pageAction = route.params.action as string;

  provide('nodesStatus', nodesStatus);

  const fetchData = async () => {
    if (!flowName) return;
    try {
      const params = {
        name: flowName
      };
      const { data } = await queryWorkflowItem(params);
      dagData.value = data;
      nodesStatus.value = data.status?.nodes || {};
    } catch (error) {
      dagData.value = {};
      nodesStatus.value = {};
    }
  };

  const handleRetry = async () => {
    try {
      const data = {
        name: flowName
      };
      await retryWorkflow(data);
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleStop = async () => {
    try {
      const data = {
        name: flowName
      };
      await stopWorkflow(data);
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleStopAction = async (row) => {
    deleteModal({
      onOk: () => handleStop(),
      okText: 'common.button.stop',
      title: t('common.confirm.title', {
        action: _.toLower(t('common.button.stop'))
      })
    });
  };

  const handleRetryAction = async () => {
    deleteModal({
      onOk: () => handleRetry(),
      okText: 'common.button.retry',
      title: t('common.confirm.title', {
        action: _.toLower(t('common.button.retry'))
      })
    });
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="scss" scoped></style>
