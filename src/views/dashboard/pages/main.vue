<template>
  <div class="dashboard-wrapper">
    <a-space :size="8" direction="vertical" fill>
      <overview :basic-info="basicInfo"></overview>
      <issueSummary :data="issueData"></issueSummary>
      <infoSummary></infoSummary>
      <licenseSummary></licenseSummary>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { reactive, ref } from 'vue';
  import overview from '../components/overview.vue';
  import issueSummary from '../components/issue-summary.vue';
  import infoSummary from '../components/info-summary.vue';
  import licenseSummary from '../components/license-summary.vue';
  import { getDashBoardOverview } from '../api/dashboard';

  const basicInfo = reactive({});
  const issueData = ref({});

  const fetchData = async () => {
    try {
      const { data } = await getDashBoardOverview();
      const basic = get(data, 'basic') || {};
      issueData.value = get(data, 'issue') || {};
      Object.assign(basicInfo, basic);
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
