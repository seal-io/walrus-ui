<template>
  <div class="s-bom-list container">
    <!-- <GroupTitle :title="$t('projects.detail.basic')"></GroupTitle> -->
    <a-card
      class="general-card q-s-w-card"
      :bordered="false"
      style="margin-bottom: 10px"
    >
      <a-spin :loading="loading" style="display: block">
        <a-row>
          <a-col :span="24">
            <div class="basic-wrap">
              <a-descriptions
                :title="$t('projects.detail.basic')"
                :data="repoData"
                :column="4"
                :bordered="false"
                class="com-info"
                layout="inline-vertical"
              >
                <a-descriptions-item
                  v-for="item in repoData"
                  :key="item.label"
                  :label="$t(item.label)"
                >
                  <a-link
                    v-if="item.key === 'url'"
                    :href="item.value"
                    target="_blank"
                    >{{ item.value }}</a-link
                  >
                  <span v-else-if="item.key === 'fullName'" class="project">
                    <ProviderIcon
                      :provider="basicInfo.provider"
                      style="margin-right: 5px"
                    ></ProviderIcon>
                    <span class="val">{{ item.value }}</span>
                    <a-tag
                      v-if="['github', 'gitlab'].includes(basicInfo.provider)"
                      color="#37D4CF"
                      size="small"
                    >
                      <template #icon
                        ><icon-branch />{{ basicInfo.branch }}</template
                      >
                    </a-tag>
                  </span>
                  <span v-else class="val">{{
                    dayjs(item.value).format('YYYY-MM-DD HH:mm:ss')
                  }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-col>
        </a-row>
      </a-spin>
    </a-card>
    <comCard
      :title="$t('projects.resource.violation.title')"
      style="margin-bottom: 10px"
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
              style="margin-top: 10px"
              :query="query"
            ></violationTrend>
          </a-tab-pane>
          <a-tab-pane key="fix" :title="$t('dashboard.summary.overview.fix')">
            <violationFix
              style="margin-top: 10px"
              :query="query"
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
        </a-tabs>
      </div>
    </comCard>
    <com-card :title="$t('projects.detail.summary')">
      <!-- <Component :is="TabComponent"></Component> -->
      <a-tabs
        :active-key="activePageTab"
        lazy-load
        type="line"
        default-active-key="fix"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in tabsList"
          :key="item.value"
          :title="$t(item.label)"
        >
          <Component
            :is="tabMap[item.component]"
            :need-update-settings="needUpdateSettings"
            @refresh="handleRefreshChart"
          ></Component>
        </a-tab-pane>
      </a-tabs>
    </com-card>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { get, find, random } from 'lodash';
  import { PieSeriesOption } from 'echarts';
  import { useRoute } from 'vue-router';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import comCard from '@/components/page-wrap/com-card.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import { tableListRow, queryResourceItem } from '@/api/projects';
  import { reactive, ref, computed, provide } from 'vue';
  import useLoading from '@/hooks/loading';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import useReportSummary from '@/views/report/hooks/use-report-summary';
  import dateRange from '@/views/dashboard/components/date-range.vue';
  import violationTab from '../components/issue-summary/violation-tab.vue';
  import violationTrend from '../components/issue-summary/violation-trend.vue';
  import violationFix from '../components/issue-summary/violation-fix.vue';
  import TabComponent from '../components/tab-component/index.vue';
  import TabFix from '../components/tab-fix/index.vue';
  import TabViolation from '../components/tab-violation/index.vue';
  import {
    queryFixAdviceList,
    ListParams,
    FixAdviceItem,
  } from '../api/fix-advice';
  import {
    tabList,
    repoBasicConfig,
    withIssuesList,
    pieConfig,
    issueTabList,
  } from '../config';

  // const dataList = ref<TableRowData[]>([]);
  interface repoDataItem extends tableListRow {
    label: string;
    value: string;
    span?: number;
  }
  const tabMap = {
    TabComponent,
    TabViolation,
    TabFix,
  };
  const query = reactive({
    timeUnit: 'day',
    start: dayjs().subtract(30, 'd').format('YYYY-MM-DD'),
    end: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
  });
  const basicInfo = reactive({
    namespace: '',
    url: '',
    createTime: '',
    fullName: '',
    kind: '',
    lastEvaluationTime: '',
    provider: '',
    branch: '',
    name: '',
    issueHighCount: '',
    issueMediumCount: '',
    issueLowCount: '',
  });
  provide('basicInfo', basicInfo);
  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const activePageTab = ref('fix');
  const activeTab = ref('violation');
  const hasFixAdvice = ref(true);
  const tabsList = ref<{ label: string; value: string; component: string }[]>(
    []
  );
  const sbomList = ref();
  const sbomTree = ref();
  const timer: any = null;
  const needUpdateSettings = ref(false);
  const violationSummary = ref({});
  const loadend = ref(false);
  const repoData = computed(() => {
    const list = repoBasicConfig
      .map((item) => {
        return {
          label: item.label,
          key: item.key,
          value: basicInfo[item.key],
          ...basicInfo,
        };
      })
      .filter((s) => {
        if (basicInfo.provider === 'kubernetes') {
          return s.key !== 'url';
        }
        if (s.key === 'url' && !basicInfo[s.key]) {
          return false;
        }
        return true;
      });
    return list;
  });

  const setTabList = () => {
    tabsList.value = issueTabList.filter((item) => {
      if (basicInfo.kind !== 'repository' || !hasFixAdvice.value) {
        return item.value !== 'fix';
      }
      return true;
    });
    activePageTab.value = get(tabsList.value, '0.value');
  };
  const getRepoData = async () => {
    try {
      setLoading(true);
      const { id, lastEvaluationTime } = route.query;
      const { data } = await queryResourceItem({ id: id as string });
      const obj = lastEvaluationTime ? { lastEvaluationTime } : {};
      Object.assign(basicInfo, data, {
        branch: get(data, 'repositoryConfiguration.branches.0'),
        ...obj,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleReset = () => {};
  const handleTabChange = (key) => {
    activePageTab.value = key;
  };
  const handleIssueTabChange = (val) => {
    activeTab.value = val;
  };
  const handleRefreshChart = async (data?) => {
    if (data) {
      violationSummary.value = data.violationSummary;
      return;
    }
    const result = await useReportSummary({
      id: get(basicInfo, 'lastEvaluationEventID'),
      dismissed: 'false',
    });
    violationSummary.value = result.violationSummary;
    loadend.value = result.loadend;
  };
  const getFixAdviceList = async () => {
    const params = {
      resourceID: route.query.id,
      eventID: route.query.versionId,
      // page: 1,
      // perPage: 500,
    } as ListParams;
    const { data } = await queryFixAdviceList(params);
    const dataList = data.items || [];
    hasFixAdvice.value = !!dataList.length;
    if (find(dataList, (v) => v.notice)) {
      needUpdateSettings.value = true;
    }
  };
  const initData = async () => {
    await Promise.all([getRepoData(), getFixAdviceList()]);
    setTabList();
    handleRefreshChart();
  };
  initData();
</script>

<style lang="less" scoped>
  @import url('../style/vuln.less');
  @import url('@/views/commons/style/basic-info.less');

  .container {
    :deep(.arco-card-body) {
      padding: 20px 20px 20px 20px;
    }

    :deep(.arco-tabs-nav-extra) {
      line-height: 28px;
    }

    .general-card.q-s-w-card.dep {
      :deep(.arco-card-header) {
        padding-bottom: 0;
      }
    }

    :deep(.arco-tabs-nav-type-capsule) {
      // margin-bottom: -2px;
      flex-direction: row-reverse;
      padding: 10px;
      padding-bottom: 0;
      background-color: var(--color-fill-2);

      .arco-tabs-nav-tab {
        // justify-content: flex-start;
      }

      .arco-tabs-tab {
        padding: 2px 16px;
        font-weight: 500;
        line-height: inherit;
        // background-color: #fff;
        .arco-icon {
          margin-right: 2px;
          font-size: 20px;
          vertical-align: -4px;
        }

        &:hover {
          color: rgb(var(--primary-6));
        }

        &.arco-tabs-tab-active {
          // background-color: transparent;
        }
      }
    }

    :deep(.arco-tabs-tab) {
      margin-left: 5px;
      padding: 2px 0;
    }

    :deep(.arco-tabs-content) {
      padding-top: 0;
      // display: none;
    }

    :deep(.arco-tabs-nav-tab-list) {
      // border: 1px solid var(--color-neutral-3);
      border-bottom: none;
    }

    :deep(.arco-tabs-nav-type-capsule) {
      margin-bottom: -2px;
      border-radius: 4px 4px 0 0;
    }

    :deep(.arco-table-container) {
      overflow: hidden;
    }

    .basic-wrap {
      // padding: 10px;
      // background: var(--color-fill-1);
      :deep(.arco-descriptions-item-value-block) {
        padding-bottom: 0;

        .val {
          // padding: 4px 6px;
          // background: var(--color-fill-2);
          color: #86909c;
        }
      }

      :deep(.arco-descriptions-item) {
        padding: 10px;
      }

      :deep(.arco-descriptions-item-label-block) {
        padding-right: 10px;
        padding-bottom: 0;
      }

      .project {
        display: flex;
        align-items: center;
      }

      :deep(.arco-tag) {
        margin-left: 5px;
        padding: 0 6px;
      }

      :deep(.arco-tag-icon) {
        margin-right: 0;
        color: #fff;
        font-weight: 500;
      }

      .icon-btn-wrap {
        display: inline-block;
        vertical-align: middle;
      }

      .com-info {
        :deep(.arco-descriptions-body) {
          padding: 0;
          background-color: #fff;
          border: none;
          border-radius: var(--border-radius-medium);

          .arco-descriptions-table {
            border-collapse: separate;
            border-spacing: 10px;
          }

          .arco-descriptions-item-value {
            // padding: 0 10px;
          }

          .arco-descriptions-item {
            // background: #fff;
            padding: 0 10px;
            border-radius: var(--border-radius-medium);

            .pkg-name {
              font-weight: 700;
              font-size: 24px;
            }

            .pkg-version {
              padding: 0 20px;
            }
          }

          .arco-descriptions-item-label-inline {
            display: line-block;
            min-width: max-content;
          }
        }
      }
    }

    .row-icon {
      margin-right: 5px;
      padding: 1px;
      color: #86909c;
      background-color: var(--color-fill-3);
      border-radius: 2px;
      cursor: pointer;

      &:hover {
        color: rgb(var(--gray-10));
      }
    }

    :deep(.arco-table) {
      .arco-table-tr {
        .arco-table-th:nth-child(1),
        .arco-table-td:nth-child(1) {
          .arco-table-cell {
            padding-left: 16px;
          }
        }
      }
    }
  }
</style>
