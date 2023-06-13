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

  const { route, router } = useCallCommon();
  const {
    breadCrumbList,
    setBreabCrumbData,
    handleBreadChange,
    projectTemplate,
    environmentTemplate,
    serviceTemplate
  } = useProjectBreadcrumbData();
  breadCrumbList.value = [
    projectTemplate,
    environmentTemplate,
    serviceTemplate
  ];
  const id = route.query.id as string;
  const serviceId = ref(id);

  provide('serviceId', serviceId);

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

<script lang="ts">
  export default {
    name: PROJECT.ServiceDetail
  };
</script>

<style lang="less" scoped></style>
