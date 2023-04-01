<template>
  <div class="dashboard-wrapper">
    <a-space :size="8" direction="vertical" fill>
      <overview></overview>
      <DeploymentSummary :data="issueData"></DeploymentSummary>
      <CostSummary></CostSummary>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { reactive, ref } from 'vue';
  import overview from '../components/overview.vue';
  import DeploymentSummary from '../components/deployment-summary.vue';
  import CostSummary from '../components/cost-summary.vue';

  const issueData = ref({});
</script>

<style lang="less" scoped>
  .dashboard-wrapper {
    margin-top: 20px;
  }
</style>
