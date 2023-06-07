<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
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
      <a-divider style="margin: 0; border-radius: 1px" :size="4"></a-divider>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane key="enviroment" title="环境">
            <EnviromentList ref="enviromentRef"></EnviromentList>
          </a-tab-pane>
          <a-tab-pane key="variables" title="变量">
            <SecretList ref="variablesRef"></SecretList>
          </a-tab-pane>
          <a-tab-pane key="connector" title="连接器">
            <ConnectorList
              ref="connectorRef"
              show-type="component"
              direction="vertical"
              :top-gap="false"
              padding="0"
            ></ConnectorList>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
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
  import { queryProjects } from '../api';
  import { basicInfoConfig } from '../config';

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
      const defaultValue = route.params.projectId || _.get(list, '0.id');
      const defaultName = _.get(list, '0.label');
      breadCrumbList.value.push({
        value: defaultValue,
        label: defaultName,
        icon: 'icon-apps',
        type: 'Project',
        wrapperId: 'project',
        options: list
      });
      projectStore.setInfo({
        projectList: list
      });
    } catch (error) {
      console.log(error);
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
    userStore.setInfo({ currentProject: route.params.projectId });
    getProjectList();
  };
  init();
</script>

<script lang="ts">
  export default {
    name: 'ProjectDetail'
  };
</script>
