<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <templateEdit @save="handleSave" @cancel="handleCancel"></templateEdit>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import templateEdit from '../components/template-edit.vue';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';

  const emits = defineEmits(['cancel', 'save']);
  const {
    getProjectList,
    getEnvironmentList,
    setProjectList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues
  } = useProjectBreadcrumbData();
  const { t, route } = useCallCommon();
  const id = route.query.id as string;
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);

  const title = computed(() => {
    if (!id) {
      return t('applications.applications.create');
    }
    return t('applications.applications.edit');
  });
  const setBreadCrumbList = async () => {
    const [projectList, environmentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    breadCrumbList.value = [
      { ...projectRes },
      { ...environmentRes },
      {
        type: 'menu.applicationManagement.serivce',
        label: title.value
      }
    ] as BreadcrumbOptions[];
  };
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const handleSave = () => {
    emits('save');
  };

  const handleCancel = () => {
    emits('cancel');
  };
  const initData = async () => {
    const list = await initBreadValues(['env']);
    breadCrumbList.value = [
      ...list,
      {
        type: 'menu.applicationManagement.serivce',
        label: title.value
      }
    ] as BreadcrumbOptions[];
    setBreadCrumbList();
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>
