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
      <ServiceDetail :instance-id="serviceId"></ServiceDetail>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide, onMounted } from 'vue';
  import BreadWrapper from '@/components/bread-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import ServiceDetail from '@/views/application-management/applications/components/instance/index.vue';
  import useProjectBreadcrumbData from '../hooks/use-project-breadcrumb-data';

  const { route, router } = useCallCommon();
  const { breadCrumbList, setBreabCrumbData, handleBreadChange } =
    useProjectBreadcrumbData();
  const id = route.query.id || '';
  const serviceId = ref(id as string);

  provide('instanceId', serviceId);

  const handleServiceChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const init = () => {
    setBreabCrumbData();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped></style>
