<template>
  <spinCard :title="$t('dashboard.issue.overview.title')" borderless>
    <div class="card-box">
      <a-statistic :title="$t('dashboard.issue.overview.toResolve')">
        <template #extra>
          <div class="extra-value">{{ get(data, 'toResolve') || 0 }}</div>
        </template>
      </a-statistic>
      <a-statistic :title="$t('dashboard.issue.overview.fixed')">
        <template #extra>
          <div class="extra-value">
            <span class="val-item">
              <span class="text h">{{ $t('projects.risk.high') }}</span>
              <span>{{ ceil(get(data, 'resolved.high') || 0) }}</span>
            </span>
            <span class="val-item">
              <span class="text m">{{ $t('projects.risk.middle') }}</span>
              <span>{{ ceil(get(data, 'resolved.medium') || 0) }}</span>
            </span>
            <span class="val-item">
              <span class="text l">{{ $t('projects.risk.low') }}</span>
              <span>{{ ceil(get(data, 'resolved.low') || 0) }}</span>
            </span>
          </div>
        </template>
      </a-statistic>
      <a-statistic :title="$t('dashboard.issue.overview.fixTime')">
        <template #extra>
          <div class="extra-value">
            <span class="val-item">
              <span class="text h">{{ $t('projects.risk.high') }}</span>
              <span>{{ ceil(get(data, 'avgFixTime.high') || 0, 1) }}</span>
            </span>
            <span class="val-item">
              <span class="text m">{{ $t('projects.risk.middle') }}</span>
              <span>{{ ceil(get(data, 'avgFixTime.medium') || 0, 1) }}</span>
            </span>
            <span class="val-item">
              <span class="text l">{{ $t('projects.risk.low') }}</span>
              <span>{{ ceil(get(data, 'avgFixTime.low') || 0, 1) }}</span>
            </span>
          </div>
        </template>
      </a-statistic>
    </div>
    <!-- <a-divider></a-divider> -->
    <div class="data-wrapper">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ lg: 16, md: 12, sm: 24, xs: 24 }">
          <div class="chart-box">
            <a-grid :cols="24" :row-gap="10">
              <a-grid-item :span="24">
                <barChart
                  class="bar-item"
                  style="flex: 1"
                  :config-options="barOptions"
                  :data-list="resourceTypeList"
                  :show-y-label="true"
                  :height="height"
                ></barChart>
              </a-grid-item>
              <a-grid-item :span="24">
                <div class="pie-chart">
                  <a-grid :cols="24" :row-gap="10" :col-gap="10">
                    <a-grid-item :span="{ lg: 12, md: 24, sm: 24, xs: 24 }">
                      <pieChart
                        class="pie-item"
                        style="flex: 1"
                        :data-list="issueTypeDataList"
                        :height="height"
                        :config-options="pieOptions"
                        :center="pieCenter"
                        :radius="pieRadius"
                      ></pieChart>
                    </a-grid-item>
                    <a-grid-item :span="{ lg: 12, md: 24, sm: 24, xs: 24 }">
                      <pieChart
                        class="pie-item"
                        style="flex: 1"
                        :data-list="severityDataList"
                        :height="height"
                        :config-options="pieOptionsSeverity"
                        :center="pieCenter"
                        :radius="pieRadius"
                      ></pieChart>
                    </a-grid-item>
                  </a-grid>
                </div>
              </a-grid-item>
            </a-grid>
          </div>
        </a-grid-item>
        <a-grid-item :span="{ lg: 8, md: 12, sm: 24, xs: 24 }">
          <div class="list">
            <issueRank
              :title="$t('dashboard.issue.overview.rank')"
              :data-list="get(data, 'resourceRank') || []"
            ></issueRank>
          </div>
        </a-grid-item>
      </a-grid>
    </div>
  </spinCard>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { map, get, ceil } from 'lodash';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import barChart from '@/components/bar-chart/index.vue';
  import pieChart from '@/components/pie-chart/index.vue';
  import issueRank from './issue-rank.vue';
  import {
    resourceIssueTypeConfig,
    severityDataConfig,
    issueTypeDataConfig,
  } from '../config';

  const props = defineProps({
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const pieStyleConfig = {
    label: {
      show: true,
      fontWeight: '500',
      formatter: ['{a|{b}}', '{a|{c}({d}%)}'].join('\n'),
      rich: {
        a: {
          lineHeight: 16,
          fontSize: 11,
        },
      },
    },
  };
  const grid = {
    left: 0,
    right: 0,
    top: 60,
    bottom: 0,
    containLabel: true,
  };
  const title = {
    text: '',
    left: 'center',
    top: 8,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12,
    },
  };
  const height = '220px';
  const pieCenter = ['50%', '58%'];
  const pieRadius = ['40%', '60%'];
  const { t } = useI18n();
  const barOptions = computed(() => {
    return {
      title: {
        ...title,
        top: 0,
        text: t('dashboard.issue.overview.resouce'),
      },
      grid: {
        ...grid,
        top: 40,
      },
    };
  });
  const pieOptions = computed(() => {
    return {
      title: {
        ...title,
        text: t('dashboard.issue.overview.type'),
      },
      grid: {
        ...grid,
      },
      legend: {
        show: false,
        orient: 'vertical',
        top: 'middle',
        left: '60%',
        itemWidth: 20,
        itemHeight: 8,
        formatter(name) {
          return `${name}`;
        },
      },
    };
  });
  const pieOptionsSeverity = computed(() => {
    return {
      title: {
        ...title,
        text: t('dashboard.issue.overview.severity'),
      },
      grid: {
        ...grid,
      },
      legend: {
        show: false,
        orient: 'vertical',
        top: 'middle',
        left: '60%',
        itemWidth: 20,
        itemHeight: 8,
      },
    };
  });
  // resource issue
  const resourceTypeList = computed(() => {
    const list = map(resourceIssueTypeConfig, (item) => {
      return {
        ...item,
        value: get(props.data, `resourceKind.${item.key}`) || 0,
        name: t(item.name),
      };
    }).filter((sItem) => sItem.value);
    return list;
  });
  // severity
  const severityDataList = computed(() => {
    const list = map(severityDataConfig, (item) => {
      return {
        ...item,
        ...pieStyleConfig,
        value: get(props.data, `severity.${item.key}`) || 0,
        name: t(item.name),
      };
    }).filter((sItem) => sItem.value);
    return list;
  });
  // issueType
  const issueTypeDataList = computed(() => {
    const list = map(issueTypeDataConfig, (item) => {
      return {
        ...item,
        ...pieStyleConfig,
        value: get(props.data, `type.${item.key}`) || 0,
        name: t(item.name),
      };
    }).filter((sItem) => sItem.value);
    return list;
  });
</script>

<style lang="less" scoped>
  .data-wrapper {
    // display: flex;
    .chart-box {
      // display: flex;
      // flex: 1;
      // flex-direction: column;
      // margin-right: 20px;
    }

    .bar-item {
      padding: 10px;
      // background-color: rgb(233 241 252 / 50%);
      background-color: rgba(230, 244, 254, 0.5);
      border-radius: 4px;
    }

    .pie-chart {
      // display: flex;
      // margin-top: 10px;
      .pie-item {
        // background-color: rgb(233 241 252 / 50%);
        background-color: rgba(230, 244, 254, 0.5);
        border-radius: 4px;
      }
    }
  }

  .list {
    // flex-basis: 500px;
  }

  .card-box {
    display: flex;
    margin-bottom: 10px;
  }

  :deep(.arco-statistic) {
    flex: 1;
    margin-right: 10px;
    padding: 10px;
    text-align: center;
    // background: linear-gradient(#ebfdff 0%, #e9f1fc 100%);
    background-color: rgba(230, 244, 254, 0.5);
    border-radius: 4px;

    &:last-child {
      margin-right: 0;
    }

    .arco-statistic-title {
      margin-bottom: 0;
      color: var(--color-text-1);
    }

    .arco-statistic-value {
      font-weight: 400;
    }

    .extra-value {
      display: flex;
      justify-content: space-around;
      color: var(--color-text-1);
      font-size: 22px;

      .text {
        margin-right: 5px;
        padding: 0 4px;
        color: #fff;
        font-size: 13px;
        border-radius: 2px;

        &.h {
          background-color: rgba(245, 63, 63, 0.8);
        }

        &.m {
          background-color: rgba(255, 180, 0, 0.8);
        }

        &.l {
          background-color: rgba(134, 144, 156, 0.8);
        }
      }

      .val-item {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
