<template>
  <div class="container">
    <GroupTitle
      class="g-title"
      :bordered="false"
      is-detail
      :title="$t('report.detail.sealReport')"
    >
    </GroupTitle>
    <a-spin :loading="loading" style="width: 100%">
      <a-space direction="vertical" fill>
        <a-card
          class="general-card q-s-w-card"
          :title="$t('report.detail.summary')"
        >
          <a-grid :cols="4" :col-gap="10">
            <a-grid-item :span="1">
              <violationBarChart
                :loadend="pageLoading"
                type="vuln"
                :title="$t('report.detail.vulnerability')"
                :data="{
                  high: get(
                    violationSummary,
                    'vulnerability.highSeverityCount'
                  ),
                  medium: get(
                    violationSummary,
                    'vulnerability.mediumSeverityCount'
                  ),
                  low: get(violationSummary, 'vulnerability.lowSeverityCount'),
                }"
              ></violationBarChart>
            </a-grid-item>
            <a-grid-item :span="1">
              <violationBarChart
                :loadend="pageLoading"
                type="license"
                :title="$t('report.detail.license')"
                :data="{
                  high: get(violationSummary, 'license.highSeverityCount'),
                  medium: get(violationSummary, 'license.mediumSeverityCount'),
                  low: get(violationSummary, 'license.lowSeverityCount'),
                }"
              ></violationBarChart>
            </a-grid-item>
            <a-grid-item :span="1">
              <violationBarChart
                :loadend="pageLoading"
                type="configure"
                :title="$t('policy.sourceRepo.basicConfig')"
                :data="{
                  high: get(
                    violationSummary,
                    'configuration.highSeverityCount'
                  ),
                  medium: get(
                    violationSummary,
                    'configuration.mediumSeverityCount'
                  ),
                  low: get(violationSummary, 'configuration.lowSeverityCount'),
                }"
              ></violationBarChart>
            </a-grid-item>
            <a-grid-item :span="1">
              <violationBarChart
                :tips="$t('report.detail.other.desc')"
                :loadend="pageLoading"
                type="other"
                :title="$t('report.detail.customPolicy')"
                :data="{
                  high: get(violationSummary, 'other.highSeverityCount'),
                  medium: get(violationSummary, 'other.mediumSeverityCount'),
                  low: get(violationSummary, 'other.lowSeverityCount'),
                }"
              ></violationBarChart>
            </a-grid-item>
          </a-grid>
        </a-card>
        <a-card
          class="general-card q-s-w-card"
          :title="$t('report.detail.details')"
        >
          <a-descriptions :data="eventData" layout="inline-horizontal" bordered>
            <template #label="{ label }">
              <span>{{ $t(label) }}</span>
            </template>
            <template #value="{ data, value }">
              <a-link
                v-if="data.key === 'objectLink'"
                :href="value"
                target="_blank"
                >{{ value }}</a-link
              >
              <span v-else-if="data.key === 'objectName'">
                <span>{{
                  value.indexOf('#') > -1 ? `${value.split('#')[0]}` : value
                }}</span>
                <a-link
                  v-show="!!value && value.indexOf('#') > -1"
                  :href="dataInfo?.event?.objectLink"
                  target="_blank"
                  >{{ `#${value.split('#')[1]}` }}</a-link
                >
              </span>
              <span v-else-if="data.languageShow">{{ $t(value) }}</span>
              <span v-else>{{ value }}</span>
            </template>
          </a-descriptions>
        </a-card>
        <a-card
          class="general-card q-s-w-card"
          :title="$t('report.detail.issueList')"
        >
          <template #title>
            <a-space :size="50">
              <span>{{ $t('report.detail.issueList') }}</span>
              <a-select v-model="sortType" placeholder="" :bordered="false">
                <a-option value="highest">{{
                  $t('report.detail.sortByHigh')
                }}</a-option>
                <a-option value="lowest">{{
                  $t('report.detail.sortByLow')
                }}</a-option>
              </a-select>
              <a-select
                v-model="ignoreType"
                placeholder=""
                :bordered="false"
                @change="handleRefresh"
              >
                <a-option
                  v-for="item in ignoreOptions"
                  :key="item.value"
                  :value="item.value"
                  >{{ $t(item.label) }}</a-option
                >
              </a-select>
            </a-space>
          </template>
          <a-tabs
            default-active-key="1"
            :active-key="activeKey"
            @change="handleActiveTab"
          >
            <a-tab-pane
              key="1"
              :title="
                $t('report.detail.vulnerability') +
                `(${dependciesIssuesList.length})`
              "
            >
              <pager-list
                :type-list="customTypeMap"
                :list="dependciesIssuesList"
                group="dependency"
                @refresh="handleRefresh"
              ></pager-list>
            </a-tab-pane>
            <!-- <a-tab-pane
              key="2"
              :title="
                $t('report.detail.sercurityTest') +
                `(${testingIssuesList.length})`
              "
            >
              <pager-list
                :type-list="customTypeMap"
                :list="testingIssuesList"
                group="sercurity"
              ></pager-list>
            </a-tab-pane> -->
            <a-tab-pane
              key="3"
              :title="
                $t('report.detail.license') + `(${licensesIssuesList.length})`
              "
            >
              <pager-list
                :list="licensesIssuesList"
                group="license"
                :type-list="customTypeMap"
                @refresh="handleRefresh"
              ></pager-list>
            </a-tab-pane>
            <a-tab-pane
              key="4"
              :title="
                $t('policy.sourceRepo.basicConfig') +
                `(${policyIssuesList.length})`
              "
            >
              <pager-list
                :type-list="customTypeMap"
                :list="policyIssuesList"
                group="policyConfig"
                @refresh="handleRefresh"
              ></pager-list>
            </a-tab-pane>
            <!-- <a-tab-pane
              key="5"
              :title="
                $t('report.detail.depdencyInspect') +
                `(${inspectIssuesList.length})`
              "
            >
              <pager-list
                :type-list="customTypeMap"
                :list="inspectIssuesList"
                group="dependencyInspect"
              ></pager-list>
            </a-tab-pane> -->
            <a-tab-pane
              key="6"
              :title="
                $t('report.detail.customPolicy') + `(${pluginsIssues.length})`
              "
            >
              <pager-list
                :type-list="customTypeMap"
                :list="pluginsIssues"
                group="pluginIssue"
                @refresh="handleRefresh"
              ></pager-list>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-space>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { toLower, hasIn, get, assignIn } from 'lodash';
  import { ref, reactive, onMounted, computed, provide } from 'vue';
  import { useRoute } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import useLoading from '@/hooks/loading';
  import { getValueOnConfigs } from '@/utils/validate';
  import { getEventReport, issuesItem } from './api/report';
  import { getViolationType, ignoreOptions } from './configs';
  import pagerList from './components/pager-list.vue';
  import violationBarChart from './components/violation-bar-chart.vue';
  // import dataInfo from './components/data';

  const customTypeMap = ref([]);
  const { loading, setLoading } = useLoading();
  const route = useRoute();
  const { id, provider } = route.query;

  interface violationsItem {
    policy: object;
    violations: issuesItem[];
  }
  interface dataItem {
    label: string;
    value: any;
    key: string;
    languageShow?: boolean;
  }
  type eventModel = {
    objectLink?: string;
    eventTriggerName?: string;
    repositoryID?: string;
    policyIDs?: string;
    proxyID?: string;
  };
  interface dataInfoModel {
    event?: eventModel;
    violationSummary?: object;
    eventTriggerName?: string;
    violationBundles?: Array<violationsItem>;
  }
  const severityLevel = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const pageLoading = ref(false);
  let eventInfo: eventModel = reactive({});
  let dataInfo: dataInfoModel = reactive({});
  const issuesList = ref<issuesItem[]>([]);
  const sortType = ref('highest');
  const ignoreType = ref('false');
  const activeKey = ref('1');
  const eventData = ref<dataItem[]>([
    //   { label: 'Report Link', key: '', value: '' },
    {
      label: 'report.detail.eventStatus',
      key: 'status',
      value: '',
      languageShow: true,
    },
    { label: 'report.detail.eventTime', key: 'createTime', value: '' },
    {
      label: 'report.detail.eventType',
      key: 'type',
      value: '',
      languageShow: true,
    },
    {
      label: 'report.detail.triggerType',
      key: 'triggerType',
      value: '',
      languageShow: true,
    }, // Repository,Proxy,Source Code Manager
    {
      label: 'report.detail.triggerName',
      key: 'eventTriggerName',
      value: '',
      languageShow: true,
    },
    { label: 'report.detail.ObjectName', key: 'objectName', value: '' },
    // { label: 'report.detail.objectLink', key: 'objectLink', value: '' },
  ]);
  // dependencies issuesList
  const dependciesIssuesList = computed(() => {
    const list = issuesList.value.filter((item) => {
      return item.violationType === 'vulnerability';
    });
    if (sortType.value === 'lowest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return a.severityValue - b.severityValue;
      });
    }
    if (sortType.value === 'highest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return b.severityValue - a.severityValue;
      });
    }
    console.log('dependciesIssuesList===', list);
    return list;
  });
  // licenses issuesList
  const licensesIssuesList = computed(() => {
    const list = issuesList.value.filter((item) => {
      return item.violationType === 'license';
    });
    if (sortType.value === 'lowest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return a.severityValue - b.severityValue;
      });
    }
    if (sortType.value === 'highest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return b.severityValue - a.severityValue;
      });
    }
    return list;
  });
  // dependcy inspect issuesList
  // const inspectIssuesList = computed(() => {
  //   const list = issuesList.value.filter((item) => {
  //     return getViolationType(item) === 'configure';
  //   });
  //   console.log('inspectIssuesList:', list);
  //   if (sortType.value === 'lowest') {
  //     list.sort((a: issuesItem, b: issuesItem) => {
  //       return a.severityValue - b.severityValue;
  //     });
  //   }
  //   if (sortType.value === 'highest') {
  //     list.sort((a: issuesItem, b: issuesItem) => {
  //       return b.severityValue - a.severityValue;
  //     });
  //   }
  //   return list;
  // });
  const pluginsIssues = computed(() => {
    const list = issuesList.value.filter((item) => {
      return item.violationType === 'other';
    });
    console.log('inspectIssuesList:', list);
    if (sortType.value === 'lowest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return a.severityValue - b.severityValue;
      });
    }
    if (sortType.value === 'highest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return b.severityValue - a.severityValue;
      });
    }
    return list;
  });
  // policy configuration
  const policyIssuesList = computed(() => {
    const list = issuesList.value.filter((item) => {
      return item.violationType === 'configure';
    });
    if (sortType.value === 'lowest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return a.severityValue - b.severityValue;
      });
    }
    if (sortType.value === 'highest') {
      list.sort((a: issuesItem, b: issuesItem) => {
        return b.severityValue - a.severityValue;
      });
    }
    return list;
  });

  // testing issuesList
  // const testingIssuesList = computed(() => {
  //   const list = issuesList.value.filter((item) => {
  //     return item.sast;
  //   });
  //   if (sortType.value === 'lowest') {
  //     list.sort((a: issuesItem, b: issuesItem) => {
  //       return a.severityValue - b.severityValue;
  //     });
  //   }
  //   if (sortType.value === 'highest') {
  //     list.sort((a: issuesItem, b: issuesItem) => {
  //       return b.severityValue - a.severityValue;
  //     });
  //   }
  //   return list;
  // });

  let violationSummary = reactive({});

  const fetchData = async () => {
    const obj = {
      dismissed: ignoreType.value === 'all' ? undefined : ignoreType.value,
    };
    const params = {
      id,
      ...obj,
    };
    try {
      setLoading(true);
      const { data } = await getEventReport(params);
      console.log('data:', data);
      dataInfo = data;
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTriggerType = () => {
    if (eventInfo.repositoryID) {
      return 'report.detail.repository';
    }
    if (eventInfo.proxyID) {
      return 'report.detail.proxy';
    }
    return 'report.detail.scm';
  };

  const handleActiveTab = (val) => {
    activeKey.value = val;
  };
  // tranform result data
  const initData = () => {
    const info = dataInfo?.violationSummary || {};
    eventInfo = dataInfo?.event || {};
    eventInfo.eventTriggerName = dataInfo.eventTriggerName || '';

    violationSummary = Object.assign(violationSummary, info);
    const violationsList =
      dataInfo?.violationBundles || ([] as violationsItem[]);
    if (!violationsList.length) {
      issuesList.value = [];
    }
    violationsList.forEach((item) => {
      item.violations.forEach((sItem) => {
        const vulnerabilityValue =
          get(sItem, 'vulnerability.cvss.baseSeverity') || 'low';
        issuesList.value.push({
          ...sItem,
          severityValue: severityLevel[toLower(sItem.severity)],
          vulnerabilityValue: severityLevel[toLower(vulnerabilityValue)],
          policy: {
            ...item.policy,
          },
          violationType: getViolationType(sItem) as string,
        });
      });
    });

    eventData.value = eventData.value
      .map((item) => {
        if (item.key === 'triggerType') {
          item.value = getTriggerType();
        } else if (item.key === 'createTime') {
          item.value = dayjs(eventInfo[item.key]).format('YYYY-MM-DD HH:mm:ss');
        } else if (item.key === 'status') {
          item.value = getValueOnConfigs(eventInfo[item.key], []);
          console.log('item.value===', item.value);
        } else if (item.key === 'type') {
          item.value = getValueOnConfigs(eventInfo[item.key], []);
        } else {
          item.value = eventInfo[item.key];
        }
        return item;
      })
      .filter((item) => {
        if (provider === 'kubernetes' && item.key === 'objectLink') {
          return false;
        }
        return true;
      });
    //
    console.log('issuesList==', customTypeMap.value, issuesList.value);
  };
  const handleRefresh = async () => {
    issuesList.value = [];
    await fetchData();
    initData();
  };
  onMounted(async () => {
    try {
      pageLoading.value = false;
      await fetchData();
      initData();
      pageLoading.value = true;
    } catch (error) {
      pageLoading.value = true;
    }
  });
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-header-title) {
      font-size: 24px;
    }

    :deep(.arco-link) {
      padding: 1px 0;
    }

    :deep(.arco-card-header) {
      padding: 10px 20px;
    }

    :deep(.arco-grid-item) {
      // height: 120px;
      text-align: center;

      .arco-statistic {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--color-fill-2);
        border-radius: 4px;
      }

      .arco-statistic-value {
        height: 70px;
        color: var(--color-text-2);
        line-height: 70px;
      }

      .arco-statistic-title {
        height: 35px;
        color: #7d1600;
        font-weight: 500;
        line-height: 35px;
      }

      &.high {
        .arco-statistic-title {
          background-color: rgba(245, 63, 63, 0.8);
        }
      }

      &.middle {
        .arco-statistic-title {
          background-color: rgba(255, 125, 0, 0.8);
        }
      }

      &.low {
        .arco-statistic-title {
          background-color: rgba(250, 220, 25, 0.8);
        }
      }
    }
  }
</style>
