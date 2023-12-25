<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.Pipeline"
        :loading="RequestLoadingMap.pipeline"
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="({ value, item }) => handleBreadChange(value, item)"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{}">
        <template #icon>
          <i
            class="iconfont icon-pipeline"
            style="color: #fff; background-color: rgb(var(--arcoblue-5))"
          ></i>
        </template>
        <template #title>
          <div class="title">
            <span> {{ currentInfo.name }}</span>
            <StatusLabel
              :zoom="0.9"
              :status="{
                status: _.get(currentInfo, 'status.summaryStatus') || '',
                text: _.get(currentInfo, 'status.summaryStatus'),
                message:
                  _.get(currentInfo, 'status.summaryStatusMessage') || '',
                transitioning: _.get(currentInfo, 'status.transitioning'),
                error: _.get(currentInfo, 'status.error')
              }"
            ></StatusLabel>
          </div>
          <div v-if="moreActions.length" class="dropdown">
            <DropButtonGroup
              :actions="actionList"
              size="medium"
              @select="handleSelect"
            ></DropButtonGroup>
          </div>
        </template>
        <template #description>
          <div class="description">{{ currentInfo.description }}</div>
        </template>
      </HeaderInfo>
      <ComCard :title="$t('workflow.stage.records')" padding="0 16px 16px 16px">
        <RecordsList></RecordsList>
      </ComCard>
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
  import { ref, onMounted, computed } from 'vue';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { WORKFLOW } from '@/router/config';
  import { execSucceed } from '@/utils/monitor';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { PipelineTabs } from '@/views/config';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import FlowView from '../components/flow-view.vue';
  import { queryPipelineDetail, applyPipeline } from '../api';
  import RecordsList from '../components/records-list.vue';
  import { pipelineDetailActions, moreActions } from '../config';
  import runConfig from '../components/run-config.vue';
  import useRunWorkflow from '../hooks/use-run-workflow';

  const {
    getProjectList,
    setProjectList,
    setPipelineList,
    getPipelineList,
    initBreadValues,
    pageLevelMap,
    RequestLoadingMap,
    breadCrumbList,
    handleBreadChange
  } = useProjectBreadcrumbData();
  const { showConfig, dataInfo, handleApply, handleSave } = useRunWorkflow();
  const userStore = useUserStore();
  const height = 'calc(100vh - 262px)';
  const { route, router } = useCallCommon();
  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.PIPELINETAB,
    PipelineTabs.LATESTRUN
  );
  const projectID = route.params.projectId as string;
  const id = route.params.flowId as string;
  const currentInfo = ref<any>({});

  const handleApplyFlow = async (row) => {
    try {
      await applyPipeline({ id: row.id, projectId: row.project?.id });
      execSucceed('applications.workflow.table.runmsg');
    } catch (error) {
      // ignore
    }
  };

  const actionList = computed(() => {
    const list = _.filter(moreActions, (item) => {
      if (item.value === 'delete') return false;
      return item.filterFun ? item.filterFun(currentInfo.value) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(currentInfo.value)
        : item.disabled;
      return item;
    });
    return res;
  });
  const handleEdit = () => {
    router.push({
      name: WORKFLOW.Edit,
      params: {
        projectId: route.params.projectId
      },
      query: {
        flowId: route.params.flowId
      }
    });
  };
  const handleSelect = (val) => {
    if (val === 'edit') {
      handleEdit();
    }
    if (val === 'apply') {
      handleApply(currentInfo.value);
    }
  };
  const getPipeListDetail = async () => {
    if (!id) return;
    try {
      const { data } = await queryPipelineDetail({ id });
      currentInfo.value = data;
    } catch (error) {
      currentInfo.value = {};
      // ignore
    }
  };

  const setBreadCrumbList = async () => {
    const [projectList, pipeLineList] = await Promise.all([
      getProjectList(),
      getPipelineList()
    ]);
    const projectRes = await setProjectList(projectList);
    const pipeLineRes = setPipelineList(pipeLineList);
    breadCrumbList.value = [
      {
        ...projectRes
      },
      {
        ...pipeLineRes
      }
    ];
  };
  const init = async () => {
    const list = await initBreadValues(['pipeline']);
    breadCrumbList.value = list;
    getPipeListDetail();
  };
  onMounted(() => {
    setBreadCrumbList();
  });
  init();
</script>

<style lang="less" scoped>
  .dropdown {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
