<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleServiceChange"
      ></Breadcrumb>
    </BreadWrapper>
    <div>
      <ServiceDetail :service-id="serviceId"></ServiceDetail>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { ref, provide, onMounted, nextTick } from 'vue';
  import BreadWrapper from '@/components/bread-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import ServiceDetail from '../components/instance/index.vue';

  const { route } = useCallCommon();
  const {
    getProjectList,
    getEnvironmentList,
    getServiceList,
    setProjectList,
    setEnvironmentList,
    setServiceList
  } = useProjectBreadcrumbData();
  const { breadCrumbList, handleBreadChange, initBreadValues } =
    useProjectBreadcrumbData();
  const id = route.query.id as string;
  const serviceId = ref(id);

  provide('serviceId', serviceId);

  const handleServiceChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const setBreabCrumbData = async () => {
    const [projectList, environmentList, serviceList] = await Promise.all([
      getProjectList(),
      getEnvironmentList(),
      getServiceList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    const serviceRes = setServiceList(serviceList);
    breadCrumbList.value = [
      { ...projectRes },
      { ...environmentRes, backAction: !route.query.from },
      serviceRes
    ];
  };
  const init = async () => {
    breadCrumbList.value = await initBreadValues(['env', 'service']);
    setBreabCrumbData();
  };

  onMounted(() => {
    init();
  });
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceDetail
  };
</script>

<style lang="less" scoped></style>
