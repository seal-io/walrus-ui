<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.Project"
        :loading="RequestLoadingMap.project"
        :menu="{ icon: 'icon-apps', label: '' }"
        :items="breadCrumbList"
        @change="handleProjectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-project"></i>
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
                resource: Resources.Environments,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.ENVIRONMENT"
            :title="$t('menu.operatorHub.evniroment')"
          >
            <EnviromentList ref="enviromentRef"></EnviromentList>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Variables,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.VARIABLES"
            :title="$t('menu.applicationManagement.secret')"
          >
            <variableList></variableList>
          </a-tab-pane>

          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.CONNECTOR"
            :title="$t('menu.operatorHub.connector')"
          >
            <ConnectorList scope="project"></ConnectorList>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                projectID: route.params.projectId,
                resource: Resources.ProjectSubjects,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.MEMBER"
            :title="$t('menu.applicationManagement.members')"
          >
            <members></members>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { ref, onMounted } from 'vue';
  import _ from 'lodash';
  import { QAlinkMap, ProjectTabs } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { useUserStore, useTabBarStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import EnviromentList from '@/views/application-management/environments/pages/list.vue';
  import variableList from '@/views/application-management/variables/pages/list.vue';
  import members from '@/views/application-management/members/pages/list.vue';
  import basicInfo from '@/views/application-management/services/components/basic-info.vue';
  import ConnectorList from '@/views/operation-hub/connectors/components/table-list.vue';
  import useBasicInfoData from '../hooks/use-basicInfo-data';
  import { queryItemProject } from '../api';
  import { basicInfoConfig, projectDetailTabs } from '../config';
  import userProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const {
    pageLevelMap,
    RequestLoadingMap,
    getProjectList,
    setProjectList,
    breadCrumbList,
    projectTemplate,
    handleBreadChange,
    initBreadValues
  } = userProjectBreadcrumbData();
  const { router, route } = useCallCommon();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const activeKey = ref<string>(
    tabBarStore.getDefaultPageTabActive(
      tabBarStore.tabPage.ProjectTab,
      ProjectTabs.ENVIRONMENT
    )
  );
  console.log('activeKey', tabBarStore, activeKey.value);
  const currentInfo = ref<any>({});
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);

  breadCrumbList.value = [projectTemplate];

  const initActiveTab = () => {
    if (_.find(projectDetailTabs, { value: activeKey.value })) {
      return;
    }
    const list = _.filter(projectDetailTabs, (item) => {
      return userStore.hasProjectResourceActions({
        resource: _.get(Resources, item.resource),
        projectID: route.params.projectId,
        actions: [Actions.GET]
      });
    });
    activeKey.value = _.get(list, '0.value') || '';
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
    tabBarStore.setPageTabActive(
      tabBarStore.tabPage.ProjectTab,
      activeKey.value
    );
  };

  const getItemProjectInfo = async () => {
    if (!route.params.projectId) return;
    try {
      const params = {
        id: route.params.projectId as string
      };
      const { data } = await queryItemProject(params);
      currentInfo.value = data;
    } catch (error) {
      currentInfo.value = {};
    }
  };
  const handleProjectChange = ({ value, item }) => {
    const data = _.find(item.options, (s) => s.value === value);
    item.value = value;
    currentInfo.value = data;
    handleBreadChange(value, item);
    initActiveTab();
  };
  const initBread = async () => {
    const projectList = await getProjectList();
    userStore.setInfo({ currentProject: route.params.projectId });
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [{ ...projectRes }];
  };
  const init = async () => {
    getItemProjectInfo();
    initActiveTab();
    breadCrumbList.value = await initBreadValues([]);
  };
  onMounted(() => {
    initBread();
  });
  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.Detail
  };
</script>
