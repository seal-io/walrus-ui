<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleChange"
      ></Breadcrumb>
    </BreadWrapper>
    <div>
      <ServiceDetail :instance-id="serviceId"></ServiceDetail>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import BreadWrapper from '@/components/bread-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import ServiceDetail from '@/views/application-management/applications/components/instance/index.vue';
  import useProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const { route, router } = useCallCommon();
  const { breadCrumbList, setBreabCrumbData } = useProjectBreadcrumbData();
  const id = route.query.id || '';
  const serviceId = ref(id as string);

  provide('instanceId', serviceId);

  const handleChange = (val, item) => {
    let params = {};
    let query = {};
    item.value = val;
    if (item.type === 'Environment') {
      params = {
        ...route.params,
        environmentId: val
      };
    }
    if (item.type === 'Project') {
      params = {
        ...route.params,
        projectId: val
      };
    }
    if (item.type === 'Service') {
      params = {
        ...route.params
      };
      query = {
        id: val
      };
    }
    router.replace({
      name: item.route,
      params,
      query
    });
  };
  const init = () => {
    setBreabCrumbData();
  };
  init();
</script>

<style lang="less" scoped></style>
