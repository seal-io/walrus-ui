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

  const { setProjectList } = userProjectBreadcrumbData();
  const { router, route } = useCallCommon();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const activeKey = ref('enviroment');
  const variablesRef = ref();
  const enviromentRef = ref();
  const currentInfo = ref<any>({});
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);
  const handleTabChange = (val) => {
    activeKey.value = val;
  };

  const getProjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryProjects(params);
      const list = _.map(data.items, (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
      const defaultValue = route.params.projectId || _.get(list, '0.value');
      const defaultName = _.get(list, '0.label');
      breadCrumbList.value.push({
        value: defaultValue,
        label: defaultName,
        icon: 'icon-apps',
        type: 'Project',
        wrapperId: 'project',
        options: list,
        visible: false
      });
      projectStore.setInfo({
        projectList: list
      });
    } catch (error) {
      console.log(error);
    }
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
  const handleProjectChange = (val, item) => {
    item.value = val;
    currentInfo.value = item;
    userStore.setInfo({ currentProject: val });
    router.replace({
      name: 'ProjectDetail',
      params: {
        projectId: val
      }
    });
  };
  const init = async () => {
    getItemProjectInfo();
    userStore.setInfo({ currentProject: route.params.projectId });
    const projectRes = await setProjectList(projectStore.projectList);
    breadCrumbList.value = [projectRes];
  };
  init();
</script>

<script lang="ts">
  export default {
    name: 'ProjectDetail'
  };
</script>
