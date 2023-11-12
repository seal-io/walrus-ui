<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.Service"
        :loading="RequestLoadingMap.service"
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @search="handleSearch"
        @change="handleServiceChange"
      ></Breadcrumb>
    </BreadWrapper>
    <div>
      <ServiceDetail :service-list="serviceDataList"></ServiceDetail>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _, { cloneDeep } from 'lodash';
  import { PROJECT } from '@/router/config';
  import { useServiceStore } from '@/store';
  import { ref, provide, onMounted, nextTick } from 'vue';
  import BreadWrapper from '@/components/bread-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import ServiceDetail from '../components/instance/index.vue';
  import { ServiceRowData } from '../config/interface';
  import { ProvideServiceIDKey } from '../config';

  const { route, router } = useCallCommon();
  const {
    pageLevelMap,
    RequestLoadingMap,
    getProjectList,
    getEnvironmentList,
    getServiceList,
    setProjectList,
    setEnvironmentList,
    setServiceList
  } = useProjectBreadcrumbData();
  const { breadCrumbList, handleBreadChange, initBreadValues } =
    useProjectBreadcrumbData();
  const serviceStore = useServiceStore();
  const id = route.query.id as string;
  const serviceId = ref(id);
  // when chunk request data update will be used to match the current service
  const serviceDataList = ref<ServiceRowData[]>([]);

  provide(ProvideServiceIDKey, serviceId);

  const handleServiceChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const handleSearch = async (item) => {
    if (item.level !== pageLevelMap.Service || !item.inputValue) return;
    const list = await getServiceList({
      page: 1,
      perPage: 10,
      query: item.inputValue
    });
    //
    if (!_.find(list, (o) => o.id === item.value)) {
      list.push({
        ...cloneDeep(serviceStore.getServiceInfo(item.value))
      });
    }
    const serviceRes = setServiceList([...list]);
    breadCrumbList.value = [
      { ...breadCrumbList.value[0] },
      { ...breadCrumbList.value[1] },
      { ...serviceRes, ..._.omit(item, ['options']) }
    ];
    serviceDataList.value = [
      { ...cloneDeep(serviceStore.getServiceInfo(id)) },
      ...list
    ];
  };
  const checkoutCurrentService = () => {
    nextTick(() => {
      if (!serviceDataList.value.length) {
        router.back();
      }
    });
  };
  const setBreabCrumbData = async () => {
    const [projectList, environmentList, serviceList] = await Promise.all([
      getProjectList(),
      getEnvironmentList(),
      getServiceList({ page: 1, perPage: 10 })
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    const serviceRes = setServiceList([
      ..._.uniqBy(
        [...serviceList, { ...serviceStore.getServiceInfo(id) }],
        'id'
      )
    ]);
    // when from dashboard there is no from query
    breadCrumbList.value = [
      { ...projectRes },
      { ...environmentRes, backAction: !route.query.from },
      serviceRes
    ];
    serviceDataList.value = serviceList;
  };
  const init = async () => {
    breadCrumbList.value = await initBreadValues(['env', 'service']);
    await setBreabCrumbData();
    checkoutCurrentService();
  };

  onMounted(() => {
    init();
    console.log('breadCrumbList>>>>>>>>', breadCrumbList.value);
  });
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceDetail
  };
</script>

<style lang="less" scoped></style>
