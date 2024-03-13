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
      <HeaderInfo :info="currentInfo" icon-type="line">
        <template #icon>
          <i class="iconfont icon-layer"></i>
        </template>
        <template #title>
          <div class="title">
            {{ currentInfo.name }}
          </div>
        </template>
        <template #description>
          <div class="description">{{ currentInfo.description }}</div>
        </template>
      </HeaderInfo>
      <ComCard padding="0 var(--card-content-padding) 20px">
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
                projectID: route.params.projectId,
                resource: Resources.Workflows,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.WORKFLOW"
            :title="$t('menu.applicationManagement.workflow')"
          >
            <WorkflowList></WorkflowList>
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
                resource: Resources.Templates,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.TEMPLATES"
            :title="$t('menu.operatorHub.module')"
          >
            <TemplateList :current-view="dataView.templates"></TemplateList>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Catalogs,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            :key="ProjectTabs.CATALOGS"
            :title="$t('menu.operatorHub.catalog')"
          >
            <CatalogList></CatalogList>
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
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { ProjectTabs } from '@/views/config';
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
  import _ from 'lodash';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import useCallCommon from '@/hooks/use-call-common';
  import { useUserStore, useProjectStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import EnviromentList from '@/views/application-management/environments/pages/list.vue';
  import variableList from '@/views/application-management/variables/pages/list.vue';
  import members from '@/views/application-management/members/pages/list.vue';
  import ConnectorList from '@/views/operation-hub/connectors/components/table-list.vue';
  import TemplateList from '@/views/application-management/templates/pages/list.vue';
  import CatalogList from '@/views/application-management/catalogs/pages/list.vue';
  import WorkflowList from '@/views/application-management/workflows/pages/list.vue';
  import {
    listenFilterCatalogAction,
    removeFilterCatalogActionListener,
    emitFilterTemplateAction
  } from '@/views/operation-hub/hooks/filter-catalog-listener';
  import { queryItemProject } from '../api';
  import { projectDetailTabs } from '../config';
  import userProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const iconList = [
    {
      icon: 'icon-apps',
      view: 'thumb',
      iconfont: false
    },
    {
      icon: 'icon-table',
      view: 'list',
      iconfont: true
    }
  ];

  const dataView = reactive({
    templates: 'thumb'
  });

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
  const projectStore = useProjectStore();

  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.PROJECTTAB,
    ProjectTabs.ENVIRONMENT
  );

  const currentInfo = ref<any>({});

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
    setPageTabActive(val);
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
  listenFilterCatalogAction((data) => {
    handleTabChange(ProjectTabs.TEMPLATES);
    setTimeout(() => {
      emitFilterTemplateAction(data);
    }, 100);
  });

  onMounted(() => {
    initBread();
    projectStore.setEnterProjectDefault({
      projectId: route.params.projectId,
      detail: true,
      list: false
    });
  });

  onBeforeUnmount(() => {
    removeFilterCatalogActionListener();
  });

  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.Detail
  };
</script>
