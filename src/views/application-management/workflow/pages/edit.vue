<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="[
          ...breadCrumbList,
          {
            type: 'applications.workflow.name',
            label: title
          }
        ]"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard>
      <flow-editor :height="height"></flow-editor>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { WORKFLOW } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import flowEditor from '../components/flow-editor.vue';

  const height = 'calc(100vh - 90px)';
  const { t, route } = useCallCommon();
  const id = route.query.id as string;
  const {
    getProjectList,
    setProjectList,
    initBreadValues,
    breadCrumbList,
    handleBreadChange
  } = useProjectBreadcrumbData();

  const title = computed(() => {
    if (id) {
      return t('applications.workflow.edit');
    }
    return t('applications.workflow.create');
  });

  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const setBreadCrumbList = async () => {
    const list = await initBreadValues();

    breadCrumbList.value = [...list];

    const projectList = await getProjectList();
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [
      {
        ...projectRes
      }
    ];
  };
  const init = async () => {
    setBreadCrumbList();
  };
  init();
</script>

<script lang="ts">
  export default {
    name: WORKFLOW.Edit
  };
</script>
