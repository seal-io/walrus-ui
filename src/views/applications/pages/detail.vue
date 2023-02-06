<template>
  <div class="application-detail">
    <comCard
      style="margin-top: 20px"
      :title="$t('applications.detail.basic.title')"
      :body-style="{ marginBottom: '10px' }"
    >
      <a-descriptions
        :data="basicDataList"
        :column="3"
        :bordered="false"
        class="com-info"
        layout="inline-vertical"
      >
        <template #label="{ label }">
          <div>{{ $t(label) }}</div>
        </template>
      </a-descriptions>
    </comCard>
    <com-card
      :title="$t('projects.resource.violation.title')"
      style="margin-top: 10px; margin-bottom: 10px"
    >
      <div>
        <a-tabs
          default-active-key="violation"
          :active-key="activeTab"
          @change="handleIssueTabChange"
        >
          <a-tab-pane
            key="violation"
            :title="$t('dashboard.summary.overview.violation')"
          >
            <violationTab
              :loadend="loadend"
              :violation-summary="violationSummary"
              style="margin-top: 10px"
            ></violationTab>
          </a-tab-pane>
          <a-tab-pane
            key="trend"
            :title="$t('dashboard.summary.overview.issueTrend')"
          >
            <violationTrend
              :query="query"
              style="margin-top: 10px"
              page="application"
            ></violationTrend>
          </a-tab-pane>
          <a-tab-pane key="fix" :title="$t('dashboard.summary.overview.fix')">
            <violationFix
              :query="query"
              style="margin-top: 10px"
              page="application"
            ></violationFix>
          </a-tab-pane>
          <template #extra>
            <dateRange
              v-show="activeTab !== 'violation'"
              v-model:time-unit="query.timeUnit"
              v-model:end="query.end"
              v-model:start="query.start"
            ></dateRange>
          </template>
          <!-- <a-tab-pane key="component" title="组件">
            <violationComponent style="margin-top: 10px"></violationComponent>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </com-card>
    <comCard :title="$t('applications.tab.title')" padding="10px 20px 0px">
      <a-tabs
        v-model="activePageTab"
        lazy-load
        type="line"
        default-active-key="resource"
      >
        <a-tab-pane
          v-for="item in issueTabList"
          :key="item.value"
          :title="$t(item.label)"
        >
          <Component
            :is="tabMap[item.component]"
            :basic-info="appInfo"
            @refresh="handleRefreshViolation"
          ></Component>
        </a-tab-pane>
      </a-tabs>
    </comCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { assignIn, map, get } from 'lodash';
  import { reactive, ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import comCard from '@/components/page-wrap/com-card.vue';
  import violationTab from '@/views/projects/components/issue-summary/violation-tab.vue';
  import violationTrend from '@/views/projects/components/issue-summary/violation-trend.vue';
  import violationFix from '@/views/projects/components/issue-summary/violation-fix.vue';
  import dateRange from '@/views/dashboard/components/date-range.vue';
  import violationComponent from '../components/violation-component.vue';
  import TabComponent from '../components/tab-component.vue';
  import TabResource from '../components/tab-resource.vue';
  import TabViolation from '../components/tab-violation.vue';
  import { issueTabList, basicConfig } from '../config';
  import {
    queryAppsItem,
    TableRowData,
    queryApplicationViolations,
  } from '../api/applications';

  const { route } = useCallCommon();
  const id = route.query.id as string;
  const activePageTab = ref('resource');
  const activeTab = ref('violation');
  const appInfo = reactive({
    createTime: '',
    description: '',
    id: '',
    issueHighCount: '',
    issueLowCount: '',
    issueMediumCount: '',
    issueTotalCount: '',
    name: '',
    resourceCount: '',
    updateTime: '',
  });
  const query = reactive({
    timeUnit: 'day',
    start: dayjs().subtract(30, 'd').format('YYYY-MM-DD'),
    end: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
  });
  const tabMap = {
    TabComponent,
    TabViolation,
    TabResource,
  };
  const violationSummary = ref({});
  const loadend = ref(false);
  const basicDataList = computed(() => {
    const list = map(basicConfig, (item) => {
      return {
        ...item,
        label: item.label,
        value:
          item.key === 'createTime'
            ? dayjs(get(appInfo, item.key)).format('YYYY-MM-DD HH:mm:ss')
            : get(appInfo, item.key),
        key: item.key,
      };
    });
    return list;
  });
  const getAppDadaInfo = async () => {
    const params = {
      id,
    };
    const { data } = await queryAppsItem(params);
    assignIn(appInfo, data);
  };
  const handleIssueTabChange = (val) => {
    activeTab.value = val;
  };
  const handleRefreshViolation = (data) => {
    violationSummary.value = data?.violationSummary || {};
  };
  const getViolationSummary = async () => {
    const params = {
      id: route.query.id as string,
      dismissed: 'false',
    };
    try {
      loadend.value = false;
      const { data } = await queryApplicationViolations(params);
      violationSummary.value = data?.violationSummary || {};
      loadend.value = true;
    } catch (error) {
      console.log(error);
      loadend.value = true;
    }
  };

  const initData = () => {
    getAppDadaInfo();
    getViolationSummary();
  };
  initData();
</script>

<style lang="less" scoped>
  @import url('@/views/commons/style/basic-info.less');

  .application-detail {
    font-size: 0;

    :deep(.arco-tabs-nav-extra) {
      line-height: 28px;
    }

    :deep(.arco-tabs-content) {
      padding-top: 0;
    }

    :deep(.arco-tabs-tab) {
      margin-left: 5px;
      padding: 2px 0;
    }
  }
</style>
