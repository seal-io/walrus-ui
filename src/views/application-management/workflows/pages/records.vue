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
            <span> {{ currentInfo.displayName }}</span>
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
          <div v-if="pipelineDetailActions.length" class="dropdown">
            <!-- <DropButtonGroup
              layout="horizontal"
              :actions="pipelineDetailActions"
              @click="handleClick"
              @select="handleSelect"
            ></DropButtonGroup> -->
            <a-button size="mini" type="text" @click="handleSelect">
              <a-tooltip :content="$t('common.button.edit')">
                <icon-edit style="stroke-width: 4" />
              </a-tooltip>
            </a-button>
          </div>
        </template>
        <template #description>
          <div class="description">{{ currentInfo.description }}</div>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="setPageTabActive"
        >
          <a-tab-pane :key="PipelineTabs.LATESTRUN" title="最近运行结果">
            <FlowView :show-latest="true" :container-height="height"></FlowView>
          </a-tab-pane>
          <a-tab-pane :key="PipelineTabs.HISTORY" title="运行记录">
            <RecordsList></RecordsList>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, onMounted } from 'vue';
  import { WORKFLOW } from '@/router/config';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { PipelineTabs } from '@/views/config';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import FlowView from '../components/flow-view.vue';
  import { queryPipelineDetail } from '../api';
  import RecordsList from '../components/records-list.vue';
  import { pipelineDetailActions } from '../config';

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
  const height = 'calc(100vh - 262px)';
  const { route, router } = useCallCommon();
  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.PIPELINETAB,
    PipelineTabs.LATESTRUN
  );
  const id = route.params.flowId as string;
  const currentInfo = ref<any>({});

  const handleClick = () => {};
  const handleSelect = () => {
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
