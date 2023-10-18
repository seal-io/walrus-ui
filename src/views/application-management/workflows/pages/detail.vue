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
      <template #right>
        <a-space fill :size="20" align="end" style="margin-right: 60px">
          <a-button type="outline" size="small" @click="handleBack">
            {{ $t('common.button.back') }}
          </a-button>
          <a-button type="primary" size="small" @click="handleSubmitApply">
            {{ $t('common.button.retry') }}
          </a-button>
        </a-space>
      </template>
    </BreadWrapper>
    <ComCard padding="0">
      <FlowView ref="flow" :height="height"></FlowView>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { WORKFLOW } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import FlowView from '../components/flow-view.vue';
  import { applyPipeline } from '../api';

  const height = 'calc(100vh - 90px)';
  const { t, route, router } = useCallCommon();
  const id = route.query.pid as string;
  const flow = ref();
  const {
    getProjectList,
    setProjectList,
    initBreadValues,
    breadCrumbList,
    handleBreadChange
  } = useProjectBreadcrumbData();

  const title = computed(() => {
    if (id) {
      return t('applications.workflow.view');
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

  const handleBack = () => {
    router.back();
  };

  const handleSubmitApply = async () => {
    try {
      const data = {
        id
      };
      await applyPipeline(data);
      router.back();
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };

  init();
</script>

<script lang="ts">
  export default {
    name: WORKFLOW.Detail
  };
</script>
