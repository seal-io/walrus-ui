<template>
  <spinCard
    class="info-summary-wrap"
    :title="$t('dashboard.summary.overview.title')"
    borderless
  >
    <a-tabs
      default-active-key="issue"
      :active-key="activeTab"
      @change="handleTabChange"
    >
      <a-tab-pane key="issue" :title="$t('dashboard.summary.overview.vuln')">
        <issueTrend :query="query"></issueTrend>
      </a-tab-pane>
      <a-tab-pane
        key="component"
        :title="$t('dashboard.summary.overview.component')"
      >
        <infoComponent></infoComponent>
      </a-tab-pane>
      <template #extra>
        <dateRange
          v-show="activeTab === 'issue'"
          v-model:timeUnit="query.timeUnit"
          v-model:start="query.start"
          v-model:end="query.end"
        ></dateRange>
      </template>
    </a-tabs>
  </spinCard>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import issueTrend from './issue-trend.vue';
  import infoComponent from './info-component.vue';
  import dateRange from './date-range.vue';

  const activeTab = ref('issue');
  const query = reactive({
    timeUnit: 'day',
    start: dayjs().subtract(30, 'd').format('YYYY-MM-DD'),
    end: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
  });
  const handleTabChange = (val) => {
    activeTab.value = val;
  };
</script>

<style lang="less" scoped>
  .info-summary-wrap {
    :deep(.arco-tabs-tab) {
      margin-left: 5px;
      padding: 2px 0;
    }

    :deep(.arco-tabs-nav-extra) {
      line-height: 28px;
    }
  }
</style>
