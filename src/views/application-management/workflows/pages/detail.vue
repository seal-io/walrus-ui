<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.PipelineExcutions"
        :loading="RequestLoadingMap.pipelineExcutions"
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
      <template #right>
        <a-space fill :size="20" align="end" style="margin-right: 60px">
          <a-button type="outline" @click="handleBack">
            {{ $t('common.button.back') }}
          </a-button>
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.WorkflowExecutions,
                projectID,
                actions: [Actions.PUT]
              })
            "
            :disabled="
              !_.includes(RetryStatus, executionInfo.status?.summaryStatus)
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
            :disabled="
              !_.includes(StopableStatus, executionInfo.status?.summaryStatus)
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
    <ComCard padding="0">
      <FlowView
        ref="flow"
        :container-height="height"
        @view="handleViewInfo"
      ></FlowView>
    </ComCard>
    <runConfig
      v-model:show="showConfig"
      :info="dataInfo"
      @save="handleSave"
    ></runConfig>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { Resources, Actions } from '@/permissions/config';
  import { ref, onMounted, computed } from 'vue';
  import { useUserStore } from '@/store';
  import { WORKFLOW } from '@/router/config';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import FlowView from '../components/flow-view.vue';
  import { retryApplyPipeline, stopApplyPipeline } from '../api';
  import { StopableStatus, RetryStatus, WorkflowStatus } from '../config';
  import runConfig from '../components/run-config.vue';
  import useRunWorkflow from '../hooks/use-run-workflow';

  const height = 'calc(100vh - 62px)';
  const { t, route, router } = useCallCommon();
  const flowId = route.params.flowId as string;
  const execId = route.query.execId as string;
  const projectID = route.params.projectId as string;
  const flow = ref();
  const executionInfo = ref<any>({});
  const userStore = useUserStore();
  const {
    getProjectList,
    setProjectList,
    getPipelineList,
    setPipelineList,
    getPipelineRecordsList,
    setPipelineRecordsList,
    initBreadValues,
    breadCrumbList,
    pageLevelMap,
    RequestLoadingMap,
    handleBreadChange
  } = useProjectBreadcrumbData();

  const { showConfig, dataInfo, handleApply, handleSave } = useRunWorkflow();
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const setBreadCrumbList = async () => {
    const [projectList, pipelineList, pipelineRecords] = await Promise.all([
      getProjectList(),
      getPipelineList(),
      getPipelineRecordsList()
    ]);
    const [projectRes, pipelineRes, pipelineRecordsRes] = await Promise.all([
      setProjectList(projectList),
      setPipelineList(pipelineList),
      setPipelineRecordsList(pipelineRecords)
    ]);
    breadCrumbList.value = [
      {
        ...projectRes
      },
      {
        ...pipelineRes
      },
      {
        ...pipelineRecordsRes
      }
    ];
  };

  const handleViewInfo = (data) => {
    executionInfo.value = data;
  };
  const init = async () => {
    const list = await initBreadValues(['pipeline', 'pipelineRecords']);

    breadCrumbList.value = [...list];
  };

  const handleBack = () => {
    router.back();
  };

  const handleRetry = async () => {
    try {
      const data = {
        flowId,
        execId
      };
      await retryApplyPipeline(data);
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleStop = async () => {
    try {
      const data = {
        flowId,
        execId
      };
      await stopApplyPipeline(data);
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
    setBreadCrumbList();
  });
  init();
</script>

<script lang="ts">
  export default {
    name: WORKFLOW.Detail
  };
</script>
