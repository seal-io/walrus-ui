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
  import { ref } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import HeaderInfo from '@/components/header-info/index.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import BasicInfo from '@/views/application-management/applications/components/basic-info.vue';
  import ServiceList from '@/views/application-management/applications/pages/list.vue';
  import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import { basicInfoConfig } from '../config';
  import { queryItemEnvironments } from '../api';

  const {
    getEnvironmentList,
    getProjectList,
    setProjectList,
    setEnvironmentList
  } = useProjectData();
  const { router, route, t } = useCallCommon();
  const currentInfo = ref<any>({});
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const serviceRef = ref();
  const basicDataList = useBasicInfoData(basicInfoConfig, currentInfo);

  const handleSelectChange = (val, item) => {
    item.value = val;
    currentInfo.value = item;
    let params = {};
    if (item.type === 'Environment') {
      params = {
        ...route.params,
        environmentId: val
      };
    }
    if (item.type === 'Project') {
      params = {
        projectId: val
      };
    }
    router.replace({
      name: item.route,
      params: {
        ...params
      }
    });
  };
  const getItemEnvironmentInfo = async () => {
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
  const init = async () => {
    getItemEnvironmentInfo();
    const [projectList, enviromentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(enviromentList);
    breadCrumbList.value = [projectRes, environmentRes];
  };
  init();
</script>
