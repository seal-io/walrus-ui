<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-rongqiyunfuwu"></i>
        </template>
        <template #title>
          <BasicInfo :data-info="basicDataList"></BasicInfo>
        </template>
      </HeaderInfo>
      <ComCard>
        <ServiceList ref="serviceRef"></ServiceList>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { ref, onMounted, nextTick } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import HeaderInfo from '@/components/header-info/index.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import BasicInfo from '@/views/application-management/services/components/basic-info.vue';
  import ServiceList from '@/views/application-management/services/pages/list.vue';
  import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import { basicInfoConfig } from '../config';
  import { queryItemEnvironments } from '../api';

  const {
    getEnvironmentList,
    getProjectList,
    setProjectList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues,
    pageLevelMap,
    projectTemplate,
    environmentTemplate
  } = useProjectData();
  const { router, route, t } = useCallCommon();
  const currentInfo = ref<any>({});
  const breadCrumbList = ref<BreadcrumbOptions[]>([
    projectTemplate,
    environmentTemplate
  ]);
  const serviceRef = ref();
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);

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
      console.log(error);
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
  });
  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.EnvDetail
  };
</script>
