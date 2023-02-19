<template>
  <div class="dashboard-wrapper">
    <a-space :size="8" direction="vertical" fill>
      <overview :basic-info="basicInfo"></overview>
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
  import { getDashBoardOverview } from '../api/dashboard';

  const basicInfo = reactive({});
  const issueData = ref({});

  const fetchData = async () => {
    try {
      // const { data } = await getDashBoardOverview();
      // const basic = get(data, 'basic') || {};
      // issueData.value = get(data, 'issue') || {};
      // Object.assign(basicInfo, basic);
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
</script>

<style lang="less" scoped>
  .dashboard-wrapper {
    margin-top: 20px;
  }
</style>
