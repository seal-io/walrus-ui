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
              }) && pageAction === PageAction.EDIT
            "
            type="primary"
            @click="handleSubmit"
          >
            {{ $t('common.button.save') }}
          </a-button>
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.WorkflowExecutions,
                projectID,
                actions: [Actions.PUT]
              }) && pageAction === PageAction.VIEW
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
              }) && pageAction === PageAction.VIEW
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
    <ComCard padding="0px var(--card-content-padding) 20px">
      <a-tabs
        v-model:active-key="activeKey"
        :default-active-key="activeKey"
        class="page-line-tabs"
      >
        <a-tab-pane key="form" title="Form">
          <DagEditor
            ref="dagViewer"
            :action="!uid ? 'create' : pageAction"
            :container-height="containerHeight"
            :dag-data="dagData"
            @refresh="handleRefresh"
          ></DagEditor>
        </a-tab-pane>
        <a-tab-pane key="yaml" title="Yaml-JSON">
          <AutoReadfile
            v-model="flowSchema"
            :placeholder="langType"
            :required="false"
            :min-width="null"
            :min-height="500"
            :default-value="flowSchema"
            :lang="langType"
            :view-status="false"
            :render-key="renderKey"
            button-position="top"
          >
            <template #label>
              <a-select
                v-model="langType"
                :options="langList"
                :bordered="false"
                @change="handleLangChange"
              >
              </a-select>
            </template>
          </AutoReadfile>
        </a-tab-pane>
      </a-tabs>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    yaml2Json,
    json2Yaml
  } from '@/components/form-create/config/yaml-parse';
  import { PageAction, InputWidth } from '@/views/config';
  import AutoReadfile from '@/components/seal-form/form-components/auto-readfile.vue';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { ref, onMounted, provide, nextTick } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DagEditor from '../index.vue';
  import { Workflow } from '../config/interface';
  import {
    queryWorkflowItem,
    retryWorkflow,
    stopWorkflow,
    createWorkflow
  } from '../api';

  const containerHeight = 'calc(100vh - 110px)';
  const { route, router, t } = useCallCommon();
  const userStore = useUserStore();
  const dagData = ref({});
  const nodesStatus = ref({});
  const dagViewer = ref();
  const uid = route.query.uid as string;
  const projectID = route.params.projectID as string;
  const flowName = route.query.name as string;
  const pageAction = route.params.action as string;
  const flowSchema = ref('');
  const activeKey = ref('form');
  const langType = ref('yaml');
  const renderKey = ref(Date.now());

  provide('nodesStatus', nodesStatus);

  const langList = [
    { label: 'YAML', value: 'yaml' },
    { label: 'JSON', value: 'json' }
  ];

  const handleLangChange = (langType) => {
    if (langType === 'json') {
      flowSchema.value = JSON.stringify(yaml2Json(flowSchema.value), null, 2);
    }
    if (langType === 'yaml') {
      flowSchema.value = json2Yaml(flowSchema.value);
    }
    renderKey.value = Date.now();
  };
  const fetchData = async () => {
    if (!flowName) return;
    try {
      const params = {
        name: flowName
      };
      const { data } = await queryWorkflowItem(params);
      dagData.value = data;
      flowSchema.value = json2Yaml(data);
      nodesStatus.value = data.status?.nodes || {};
      langType.value = 'yaml';
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

  const handleRefresh = async () => {
    await fetchData();
  };
  const handleSubmit = async () => {
    let data: any = null;
    if (activeKey.value === 'form') {
      data = await dagViewer.value?.getSubmitData();
    }
    if (activeKey.value === 'yaml') {
      data = {
        workflow:
          langType.value === 'yaml'
            ? yaml2Json(flowSchema.value)
            : JSON.parse(flowSchema.value)
      };
    }
    if (!data) return;
    try {
      await createWorkflow(data);
      execSucceed();
      router.back();
    } catch (error) {
      // error
    }
    console.log('handleSubmit================', data);
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="scss" scoped></style>
