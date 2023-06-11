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
    <a-space :size="8" direction="vertical" fill>
      <overview></overview>
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
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import overview from '../components/overview.vue';
  import DeploymentSummary from '../components/deployment-summary.vue';
  import CostSummary from '../components/cost-summary.vue';

  const userStore = useUserStore();
</script>

<style lang="less" scoped>
  .dashboard-wrapper {
    margin-top: 10px;
  }
</style>
