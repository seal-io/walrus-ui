<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-apps', label: '' }"
        :items="breadCrumbList"
        @change="handleProjectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-project"></i>
        </template>
        <template #title>
          <basicInfo :data-info="basicDataList"></basicInfo>
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
            key="enviroment"
            :title="$t('menu.operatorHub.evniroment')"
          >
            <EnviromentList ref="enviromentRef"></EnviromentList>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Secrets,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            key="variables"
            :title="$t('menu.operatorHub.variables')"
          >
            <SecretList ref="variablesRef"></SecretList>
          </a-tab-pane>

          <a-tab-pane
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                projectID: route.params.projectId,
                actions: [Actions.GET]
              })
            "
            key="connector"
            :title="$t('menu.operatorHub.connector')"
          >
            <ConnectorList scope="project"></ConnectorList>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { ref, onMounted, computed, nextTick } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useUserStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import EnviromentList from '@/views/application-management/environments/pages/list.vue';
  import SecretList from '@/views/application-management/secret/pages/list.vue';
  import basicInfo from '@/views/application-management/services/components/basic-info.vue';
  import ConnectorList from '@/views/operation-hub/connectors/components/table-list.vue';
  import useBasicInfoData from '../hooks/use-basicInfo-data';
  import { queryItemProject } from '../api';
  import { basicInfoConfig, projectDetailTabs } from '../config';
  import userProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const {
    getProjectList,
    setProjectList,
    breadCrumbList,
    projectTemplate,
    handleBreadChange
  } = userProjectBreadcrumbData();
  const { router, route } = useCallCommon();
  const userStore = useUserStore();
  const activeKey = ref('enviroment');
  const currentInfo = ref<any>({});
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);

  breadCrumbList.value = [projectTemplate];

  const initActiveTab = () => {
    const list = _.filter(projectDetailTabs, (item) => {
      return userStore.hasProjectResourceActions({
        resource: _.get(Resources, item.resource),
        projectID: route.params.projectId,
        actions: [Actions.GET]
      });
    });
    activeKey.value = _.get(list, '0.value');
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
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
      console.log(error);
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
