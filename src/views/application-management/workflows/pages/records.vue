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
          <div v-if="actionList.length" class="dropdown">
            <DropButtonGroup
              :actions="actionList"
              @click="handleClick"
              @select="handleSelect"
            ></DropButtonGroup>
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
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { PipelineTabs } from '@/views/config';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import { queryPipelineDetail } from '../api';
  import RecordsList from '../components/records-list.vue';

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

  const { route } = useCallCommon();
  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.PIPELINETAB,
    PipelineTabs.HISTORY
  );
  const id = route.params.flowId as string;
  const currentInfo = ref<any>({});
  const actionList = ref<any[]>([]);

  const handleClick = () => {};
  const handleSelect = () => {};
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

<style lang="less" scoped></style>
