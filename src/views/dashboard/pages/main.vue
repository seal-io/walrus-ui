<template>
  <div class="dashboard-wrapper">
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-dashboard', label: 'menu.dashboard' }"
      ></Breadcrumb>
    </BreadWrapper>

    <a-spin style="width: 100%" :loading="loading">
      <a-space
        v-if="!isEmpty"
        :size="8"
        direction="vertical"
        fill
        style="background-color: var(--color-pagedivider-bg)"
      >
        <overview
          v-model:isEmpty="isEmpty"
          v-model:loading="loading"
        ></overview>
        <DeploymentSummary></DeploymentSummary>
      </a-space>
      <ComCard v-else>
        <a-empty class="relative">
          <template #image>
            <i
              class="iconfont icon-app-fill size-52"
              style="color: var(--sealblue-6)"
            ></i>
          </template>
          <div style="font-size: 16px">
            <span class="font-16" style="font-size: 16px">{{
              $t('dashboard.createProject.tips')
            }}</span>
            <a-button
              type="outline"
              class="font-16 m-t-20 m-l-10"
              style="font-size: 16px"
              @click="handleCreateProject"
            >
              <icon-plus class="m-r-4"></icon-plus
              >{{ $t('common.button.create.now') }}</a-button
            >
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
  import overview from '../components/overview.vue';
  import DeploymentSummary from '../components/deployment-summary.vue';

  const { router } = useCallCommon();
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
