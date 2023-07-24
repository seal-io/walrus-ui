<template>
  <div class="dashboard-wrapper">
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-dashboard', label: 'menu.dashboard' }"
      ></Breadcrumb>
    </BreadWrapper>
    <HeaderInfo :info="{ name: $t('menu.dashboard') }">
      <template #icon>
        <i class="iconfont icon-dashboard-Fill"></i>
      </template>
    </HeaderInfo>
    <a-spin style="width: 100%" :loading="loading">
      <a-space v-if="!isEmpty" :size="8" direction="vertical" fill>
        <overview
          v-model:isEmpty="isEmpty"
          v-model:loading="loading"
        ></overview>
        <DeploymentSummary></DeploymentSummary>
        <CostSummary
          v-if="
            userStore.hasRolesActionsPermission({
              resource: Resources.Dashboards,
              actions: [Actions.POST]
            })
          "
        ></CostSummary>
      </a-space>
      <ComCard v-else>
        <a-empty class="relative">
          <template #image>
            <i
              class="iconfont icon-app-fill size-52"
              style="color: var(--sealblue-6)"
            ></i>
          </template>
          <div>
            <span class="font-16">您还没有创建项目，</span>
            <a-link class="font-16 m-t-20" @click="handleCreateProject"
              >立即创建</a-link
            >
            <div style="position: absolute; top: 16px; right: 0; margin-top: 0">
              <a-tag color="#c9cdd4"><icon-bulb class="stroke-w-4" /></a-tag>
              <a-link
                class="mleft-5"
                href="https://seal-io.github.io/docs/application/project"
                target="_blank"
                >需要帮助？</a-link
              >
            </div>
          </div>
        </a-empty>
      </ComCard>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PROJECT } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import overview from '../components/overview.vue';
  import DeploymentSummary from '../components/deployment-summary.vue';
  import CostSummary from '../components/cost-summary.vue';

  const { router } = useCallCommon();
  const userStore = useUserStore();
  const isEmpty = ref(false);
  const loading = ref(false);

  const handleCreateProject = () => {
    router.push({ name: PROJECT.List });
  };
</script>

<style lang="less" scoped>
  .dashboard-wrapper {
    background-color: var(--color-fill-2);
  }
</style>
