<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-rongqiyunfuwu"></i>
        </template>
        <template #title>
          <span>{{ currentInfo.label }}</span>
        </template>
      </HeaderInfo>
      <a-divider style="margin: 0; border-radius: 1px" :size="4"></a-divider>
      <ComCard>
        <ServiceList ref="serviceRef"></ServiceList>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useProjectStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import ServiceList from '@/views/application-management/applications/pages/list.vue';
  import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';

  const {
    getEnvironmentList,
    getProjectList,
    setProjectList,
    setEnvironmentList
  } = useProjectData();
  const { router, route } = useCallCommon();
  const projectStore = useProjectStore();
  const activeKey = ref('environment');
  const currentInfo = ref<any>({});
  const serviceInfo = ref<any>({});
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const serviceRef = ref();
  // let projectList: any[] = [];
  // let environmentList: any[] = [];

  const handleSelectChange = (val, item) => {
    item.value = val;
    currentInfo.value = item;
    router.replace({
      name: 'ProjectDetail',
      params: {
        projectId: val
      }
    });
  };
  const init = async () => {
    const [projectList, enviromentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = setProjectList(projectList);
    const environmentRes = setEnvironmentList(enviromentList);
    breadCrumbList.value = [projectRes, environmentRes];
  };
  init();
</script>
