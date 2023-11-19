<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :level="pageLevelMap.Pipeline"
        :loading="RequestLoadingMap.pipeline"
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
      <template #right>
        <a-space
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              resource: Resources.Workflows,
              actions: [Actions.POST]
            })
          "
          fill
          :size="20"
          style="padding-right: 16px"
        >
          <a-button type="primary" size="small" @click="handleSubmit">
            {{ $t('common.button.save') }}
          </a-button>
          <a-button type="outline" size="small" @click="handleCancel">
            {{ $t('common.button.cancel') }}
          </a-button>
        </a-space>
      </template>
    </BreadWrapper>
    <ComCard>
      <flow-editor ref="flow" :height="height"></flow-editor>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { WORKFLOW } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import { getListLabel } from '@/utils/func';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import flowEditor from '../components/flow-editor.vue';
  import { createPipeline, updatePipeline, applyPipeline } from '../api';

  const height = 'calc(100vh - 90px)';
  const userStore = useUserStore();
  const { t, route, router } = useCallCommon();
  const projectID = route.params.projectId as string;
  const flowId = route.query.flowId as string;
  const flow = ref();
  const {
    getProjectList,
    setProjectList,
    initBreadValues,
    getPipelineList,
    setPipelineList,
    handleBreadChange,
    pageLevelMap,
    RequestLoadingMap,
    breadCrumbList
  } = useProjectBreadcrumbData();

  const title = computed(() => {
    if (flowId) {
      return t('applications.workflow.edit');
    }
    return t('applications.workflow.create');
  });

  const handleSelectChange = ({ value, item }) => {
    item.value = value;
    item.label = getListLabel(value, item.options);
    if (item.level === pageLevelMap.Pipeline) {
      router.replace({
        name: WORKFLOW.Edit,
        params: {
          projectId: route.params.projectId
        },
        query: {
          flowId: value
        }
      });
    } else {
      handleBreadChange(value, item);
    }
  };

  const setBreadCrumbList = async () => {
    const list = await initBreadValues(['pipeline']);

    breadCrumbList.value = list;

    const [projectList, pipelineList] = await Promise.all([
      getProjectList(),
      getPipelineList()
    ]);
    const [projectRes, pipelineRes] = await Promise.all([
      setProjectList(projectList),
      setPipelineList(pipelineList)
    ]);
    breadCrumbList.value = [
      {
        ...projectRes
      }
    ];
    if (!flowId) {
      breadCrumbList.value.push({
        type: 'applications.workflow.name',
        label: t('applications.workflow.create')
      } as any);
    } else {
      breadCrumbList.value.push({
        ...pipelineRes
      });
    }
  };
  const init = async () => {
    setBreadCrumbList();
  };

  const handleSubmit = async () => {
    const formData = await flow.value?.getData?.();
    if (!formData) return;
    try {
      const data = {
        ...formData.basic,
        stages: formData.stages
      };
      if (flowId) {
        await updatePipeline(data);
      } else {
        await createPipeline(data);
      }
      router.back();
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };

  const handleCancel = () => {
    router.back();
  };
  init();
</script>

<script lang="ts">
  export default {
    name: WORKFLOW.Edit
  };
</script>
