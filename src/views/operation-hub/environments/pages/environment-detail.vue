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
        <template #title>
          <span>{{ currentInfo.label }}</span>
        </template>
      </HeaderInfo>
      <a-divider style="margin: 0; border-radius: 1px" :size="4"></a-divider>
      <ComCard>
        <ServiceList></ServiceList>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useProjectStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import ServiceList from '@/views/application-management/applications/pages/list.vue';
  import { queryProjects } from '@/views/application-management/projects/api';
  import { queryEnvironments } from '@/views/operation-hub/environments/api';

  const { router, route } = useCallCommon();
  const projectStore = useProjectStore();
  const activeKey = ref('environment');
  const currentInfo = ref<any>({});
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  let projectList: any[] = [];
  let environmentList: any[] = [];

  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const setProjectList = () => {
    const list = _.map(projectList, (item) => {
      return {
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = route.params.projectId || _.get(list, '0.id');
    const defaultName = _.get(list, '0.label');

    projectStore.setInfo({
      projectList: _.cloneDeep(list)
    });
    return {
      value: defaultValue,
      label: defaultName,
      icon: 'icon-apps',
      type: 'Project',
      wrapperId: 'projectWrapper',
      options: _.cloneDeep(list)
    };
  };
  const setEnvironmentList = () => {
    const list = _.map(environmentList, (item) => {
      return {
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = route.params.environmentId || _.get(list, '0.id');
    const defaultName = _.get(list, '0.label');

    projectStore.setInfo({
      environmentList: _.cloneDeep(list)
    });
    return {
      value: defaultValue,
      label: defaultName,
      icon: 'icon-apps',
      type: 'Environment',
      wrapperId: 'envWrapper',
      options: _.cloneDeep(list)
    };
  };
  const getProjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryProjects(params);
      projectList = data.items || [];
    } catch (error) {
      projectList = [];
      console.log(error);
    }
  };
  const getEnvironmentList = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId || ''
      };
      const { data } = await queryEnvironments(params);
      environmentList = data.items || [];
    } catch (error) {
      environmentList = [];
      console.log(error);
    }
  };
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
    await Promise.all([getProjectList(), getEnvironmentList()]);
    const projectRes = setProjectList();
    const environmentRes = setEnvironmentList();
    breadCrumbList.value = [projectRes, environmentRes];
  };
  init();
</script>
