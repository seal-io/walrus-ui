<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.Environment"
        :loading="RequestLoadingMap.environment"
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-rongqiyunfuwu"></i>
        </template>
        <template #title>
          <!-- <basicInfo :data-info="basicDataList"></basicInfo> -->
          <div class="title">
            {{ currentInfo.name }}
          </div>
        </template>
        <template #description>
          <div class="description">{{ currentInfo.description }}</div>
        </template>
        <template #extra>
          <QuestionPopup :link="QAlinkMap.Environment"></QuestionPopup>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Services,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            key="service"
            :title="$t('menu.applicationManagement.serivce')"
          >
            <ServiceList></ServiceList>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Services,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            key="graph"
            :title="$t('applications.instance.tab.graph')"
          >
            <environmentGraph ref="graph"></environmentGraph>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Variables,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            key="variable"
            :title="$t('menu.applicationManagement.secret')"
          >
            <VariableList scope="environment"></VariableList>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { ref, onMounted, nextTick } from 'vue';
  import { QAlinkMap } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import _ from 'lodash';
  import { useUserStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import HeaderInfo from '@/components/header-info/index.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import BasicInfo from '@/views/application-management/services/components/basic-info.vue';
  import ServiceList from '@/views/application-management/services/pages/list.vue';
  import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import VariableList from '@/views/application-management/variables/components/table-list.vue';
  import { basicInfoConfig } from '../config';
  import { queryItemEnvironments } from '../api';
  import environmentGraph from '../components/environment-graph.vue';

  const {
    getEnvironmentList,
    getProjectList,
    setProjectList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues,
    RequestLoadingMap,
    pageLevelMap,
    projectTemplate,
    environmentTemplate
  } = useProjectData();
  const userStore = useUserStore();
  const { router, route, t } = useCallCommon();
  const currentInfo = ref<any>({});
  const activeKey = ref('service');
  const graph = ref();
  const breadCrumbList = ref<BreadcrumbOptions[]>([
    projectTemplate,
    environmentTemplate
  ]);
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);

  const handleTabChange = (val) => {
    if (val === 'graph') {
      graph.value?.handleRefresh();
    }
  };
  const handleSelectChange = ({ value, item }) => {
    item.value = value;
    if (item.level !== pageLevelMap.Environment) {
      currentInfo.value = {};
    } else {
      currentInfo.value = _.find(item.options, (s) => s.value === value);
    }
    handleBreadChange(value, item);
  };
  const getItemEnvironmentInfo = async () => {
    if (!route.params.environmentId) return;
    try {
      const params = {
        id: route.params.environmentId as string
      };
      const { data } = await queryItemEnvironments(params);
      currentInfo.value = data;
    } catch (error) {
      currentInfo.value = {};
    }
  };
  const initBread = async () => {
    const [projectList, enviromentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(enviromentList);
    breadCrumbList.value = [{ ...projectRes }, { ...environmentRes }];
  };
  const init = async () => {
    getItemEnvironmentInfo();
    breadCrumbList.value = await initBreadValues(['env']);
  };
  onMounted(() => {
    initBread();
    init();
  });
</script>

<script lang="ts">
  export default {
    name: PROJECT.EnvDetail
  };
</script>
