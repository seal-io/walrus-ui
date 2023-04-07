<template>
  <div class="container">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeMode="timeMode"
          :short-cuts="DateShortCuts"
          :show-extra="true"
          timezone
          today-in
          border-less
          @change="handleDateChange"
        >
          <template #cell="{ date }">
            <div class="arco-picker-date">
              <a-tooltip
                v-if="
                  get(collectedTimeRange, '0') &&
                  dayjs(get(collectedTimeRange, '0')).isSame(
                    dayjs(date).format('YYYY-MM-DD')
                  )
                "
                :content="$t('cost.analyse.cluster.date.startTips')"
              >
                <div class="arco-picker-date-value" :style="getCellStyle(date)">
                  {{ date.getDate() }}
                </div>
              </a-tooltip>
              <a-tooltip
                v-else-if="
                  get(collectedTimeRange, '1') &&
                  dayjs(get(collectedTimeRange, '1')).isSame(
                    dayjs(date).format('YYYY-MM-DD')
                  )
                "
                :content="$t('cost.analyse.cluster.date.endTips')"
              >
                <div class="arco-picker-date-value" :style="getCellStyle(date)">
                  {{ date.getDate() }}
                </div>
              </a-tooltip>
              <div v-else class="arco-picker-date">
                <div class="arco-picker-date-value" :style="getCellStyle(date)">
                  {{ date.getDate() }}
                </div>
              </div>
            </div>
          </template>
        </DateRange>
        <div><slot name="button"></slot></div>
      </template>
      <template #button-group>
        <div><slot name="view-btn"></slot></div>
      </template>
    </FilterBox>
    <SpinCard
      :loading="overviewloading || preloading"
      :title="`${$t('cost.analyse.detail.custom')}: ${projectName}`"
      borderless
      style="margin-bottom: 10px"
    >
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in summaryData"
          :key="index"
          :span="{ lg: 12, md: 12, sm: 12, xs: 24 }"
        >
          <DataCard :precision="3" :title="item.label" :bg-color="item.color">
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
            <template #extra>
              <span>{{ round(item.value, 4) || 0 }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
    </SpinCard>
    <SpinCard
      :title="$t('cost.analyse.detail.costtrend')"
      borderless
      style="margin-bottom: 10px"
    >
      <LineBarChart
        :loading="apploading || preloading"
        height="220px"
        :show-type="projectCostFilters.step ? 'line' : 'bar'"
        :line-list="projectCostChart.line"
        :bar-list="projectCostChart.bar"
        :data-config="projectCostChart.dataConfig"
        :x-axis="projectCostChart.xAxis"
        :config-options="{
          title: {
            ...title
          },
          legend: {
            right: 'center',
            top: 0
          },
          grid: {
            ...grid,
            top: 40
          }
        }"
      ></LineBarChart>
      <TableList
        :request-work="true"
        time-range="single"
        :time-mode="timeMode"
        :loadeend="loadeend"
        :filter-params="projectCostFilters"
        :columns="customTableCols"
        source="cost table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { set, get, find, map, each, round, includes } from 'lodash';
  import { reactive, ref, computed, onMounted, watch } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '../components/table-list.vue';
  import { DateShortCuts, setEndTimeAddDay, dateFormatMap } from '../config';
  import usePerspectiveCost from '../hooks/use-perspective-custom';
  import groupbyData from '../config/groupby-data';

  const props = defineProps({
    viewId: {
      type: String,
      default() {
        return '';
      }
    },
    source: {
      type: String,
      default() {
        return '';
      }
    },
    isPage: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const title = {
    text: '',
    left: 'center',
    top: 8,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12
    }
  };
  const grid = {
    left: 10,
    right: 10,
    top: 20,
    bottom: 0,
    containLabel: true
  };
  const {
    getPerspectiveItemInfo,
    getProjectCostChart,
    getSummaryData,
    projectCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams,
    apploading,
    loading,
    id,
    overviewloading,
    timeMode,
    collectedTimeRange
  } = usePerspectiveCost(props);
  const { t, route } = useCallCommon();
  const loadeend = ref(false);
  const markCellStyle = {
    border: '1px solid rgb(var(--arcoblue-6))'
  };
  const preloading = computed(() => {
    return loading.value;
  });
  const customTableCols = computed(() => {
    const groupBy = find(groupbyData, (item) => {
      return item.fieldName === get(projectCostFilters.value, 'groupBy');
    });
    const dfmt = get(dateFormatMap, projectCostFilters.value.groupBy);
    return [
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'itemName',
        title: t(groupBy?.title || '') || t('cost.analyse.table.name'),
        render({ record }) {
          if (dfmt) {
            return dayjs(record.itemName).format(dfmt);
          }
          return record.itemName;
        }
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'cpuCost',
        render({ record }) {
          return round(record.cpuCost, 4) || 0;
        },
        title: 'CPU'
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'ramCost',
        render({ record }) {
          return round(record.ramCost, 4) || 0;
        },
        title: t('cost.analyse.table.ram')
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'pvCost',
        render({ record }) {
          return round(record.pvCost, 4) || 0;
        },
        title: 'PV'
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'pvCost',
        render({ record }) {
          return round(record.loadBalancerCost, 4) || 0;
        },
        title: t('cost.analyse.table.loadbalance')
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'sharedCost',
        render({ record }) {
          return round(record.sharedCost, 4) || 0;
        },
        title: t('cost.analyse.table.shareCost')
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'totalCost',
        render({ record }) {
          return round(record.totalCost, 4) || 0;
        },
        title: t('cost.analyse.detail.totalCost')
      }
    ];
  });
  const getCellStyle = (date) => {
    return includes(collectedTimeRange.value, dayjs(date).format('YYYY-MM-DD'))
      ? markCellStyle
      : {};
  };
  const handleDateChange = async (values) => {
    queryParams.endTime = get(values, '1');
    queryParams.startTime = get(values, '0');
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    getProjectCostChart();
    getSummaryData();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    getSummaryData();
    getProjectCostChart();
    setTimeout(() => {
      loadeend.value = true;
    }, 50);
  };

  watch(
    () => route.query.page,
    (ov) => {
      if (route.query.id && route.query.page === 'custom') {
        initData();
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  onMounted(() => {
    // initData();
  });
</script>

<style></style>
