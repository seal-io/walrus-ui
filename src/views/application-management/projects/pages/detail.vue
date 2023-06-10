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
            key="enviroment"
            :title="$t('menu.operatorHub.evniroment')"
          >
            <EnviromentList ref="enviromentRef"></EnviromentList>
          </a-tab-pane>
          <a-tab-pane key="variables" :title="$t('menu.operatorHub.variables')">
            <SecretList ref="variablesRef"></SecretList>
          </a-tab-pane>
          <a-tab-pane key="connector" :title="$t('menu.operatorHub.connector')">
            <ConnectorList scope="project"></ConnectorList>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useProjectStore, useUserStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import EnviromentList from '@/views/operation-hub/environments/pages/list.vue';
  import SecretList from '@/views/application-management/secret/pages/list.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import ConnectorList from '@/views/operation-hub/connectors/components/table-list.vue';
  import basicInfo from '@/views/application-management/applications/components/basic-info.vue';
  import useBasicInfoData from '../hooks/use-basicInfo-data';
  import { queryProjects, queryItemProject } from '../api';
  import { basicInfoConfig } from '../config';
  import userProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const { getProjectList, setProjectList, breadCrumbList, handleBreadChange } =
    userProjectBreadcrumbData();
  const { router, route } = useCallCommon();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const activeKey = ref('enviroment');
  const variablesRef = ref();
  const enviromentRef = ref();
  const currentInfo = ref<any>({});
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);
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
  };
  const init = async () => {
    getItemProjectInfo();
    const projectList = await getProjectList();
    userStore.setInfo({ currentProject: route.params.projectId });
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [{ ...projectRes }];
  };
  init();
</script>

<script lang="ts">
  export default {
    name: 'ProjectDetail'
  };
</script>
