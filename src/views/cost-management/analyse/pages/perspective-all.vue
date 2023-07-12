<template>
  <div>
    <FilterBox style="margin-bottom: 8px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeMode="timeMode"
          step="day"
          :show-extra="true"
          timezone
          :short-cuts="DateShortCuts"
          today-in
          @change="handleDateChange"
        >
          <template #tips>
            <dl style="margin: 0">
              <dt style="float: left"
                ><icon-info-circle-fill style="color: rgb(var(--arcoblue-5))"
              /></dt>
              <dd style="margin-left: 16px">
                <span>{{ $t('cost.analyse.datepicker.notes') }}</span>
              </dd>
            </dl>
          </template>
          <template #cell="{ date }">
            <div class="arco-picker-date" style="align-items: center">
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
      :title="$t('cost.optimize.table.all')"
      borderless
      style="margin-bottom: 8px"
      :loading="overviewloading || preloading"
    >
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in summaryData"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
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
    <!-- ===========Daily Cost================ -->
    <SpinCard
      :title="$t('cost.analyse.detail.costtrend')"
      borderless
      style="margin-bottom: 8px"
    >
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>{{ $t('cost.analyse.detail.costtrend') }}</div>
          <ChartBtn v-model:active="active"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        height="220px"
        :loading="dailyloading || preloading"
        :show-type="active"
        :bar-list="dailyCostChart.bar"
        :line-list="dailyCostChart.line"
        :data-config="dailyCostChart.dataConfig"
        :x-axis="dailyCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :request-work="true"
        :loadeend="loadeend"
        :time-mode="timeMode"
        source="daily table"
        :filter-params="dailyCostFilters"
        :columns="dailyCostColumns"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Project Cost================ -->
    <SpinCard
      :title="$t('cost.analyse.detail.projectCost')"
      borderless
      style="margin-bottom: 8px"
    >
      <!-- <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Cost Per Project</div>
          <ChartBtn v-model:active="activeProject"></ChartBtn>
        </div>
      </template> -->
      <LineBarChart
        height="220px"
        show-type="bar"
        :loading="projectloading || preloading"
        :bar-list="projectCostChart.bar"
        :line-list="projectCostChart.line"
        :data-config="projectCostChart.dataConfig"
        :x-axis="projectCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :request-work="true"
        :time-mode="timeMode"
        :loadeend="loadeend"
        source="project table"
        :filter-params="projectCostFilters"
        :columns="perProjectCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Cluster Cost================ -->
    <SpinCard
      :title="$t('cost.analyse.detail.clusterCost')"
      borderless
      style="margin-bottom: 10px"
    >
      <!-- <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Cost Per Cluster</div>
          <ChartBtn v-model:active="activeCluster"></ChartBtn>
        </div>
      </template> -->
      <LineBarChart
        height="220px"
        show-type="bar"
        :loading="clusterloading || preloading"
        :bar-list="clusterCostChart.bar"
        :line-list="clusterCostChart.line"
        :data-config="clusterCostChart.dataConfig"
        :x-axis="clusterCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :request-work="true"
        :loadeend="loadeend"
        :time-mode="timeMode"
        source="cluster table"
        :filter-params="clusterCostFilters"
        :columns="perClusterCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { cloneDeep, map, round, get, includes } from 'lodash';
  import { reactive, ref, computed, onMounted, watch } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { onBeforeRouteUpdate } from 'vue-router';
  import FilterBox from '@/components/filter-box/index.vue';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    dailyCostCols,
    costPerClusterCols,
    costPerProjectCols,
    DateShortCuts,
    setEndTimeAddDay
  } from '../config';
  import usePerspectiveCost from '../hooks/use-perspective-cost';

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
    },
    pageloading: {
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
    left: 0,
    right: 10,
    top: 20,
    bottom: 0,
    containLabel: true
  };
  const {
    getPerspectiveItemInfo,
    getDailyCostChart,
    getProjectCostChart,
    getClusterCostChart,
    getSummaryData,
    dailyCostFilters,
    projectCostFilters,
    clusterCostFilters,
    dailyCostChart,
    projectCostChart,
    clusterCostChart,
    summaryData,
    queryParams,
    dailyloading,
    projectloading,
    clusterloading,
    loading,
    id,
    overviewloading,
    timeMode,
    collectedTimeRange
  } = usePerspectiveCost(props);
  const { route, t } = useCallCommon();
  const active = ref<'bar' | 'line'>('bar');
  const activeProject = ref<'bar' | 'line'>('bar');
  const activeCluster = ref<'bar' | 'line'>('bar');
  const loadeend = ref(false);
  const markCellStyle = {
    border: '1px solid rgb(var(--arcoblue-6))'
  };
  const loadPage = computed(() => {
    return props.viewId && props.source === 'all';
  });
  const preloading = computed(() => {
    return props.pageloading || loading.value;
  });
  const configOptions = computed(() => {
    return {
      title: {
        ...title,
        top: 0
      },
      legend: {
        show: false
      },
      grid: {
        ...grid
      }
    };
  });
  const dailyCostColumns = computed(() => {
    const list = cloneDeep(dailyCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const perClusterCols = computed(() => {
    const list = cloneDeep(costPerClusterCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const perProjectCols = computed(() => {
    const list = cloneDeep(costPerProjectCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const getCellStyle = (date) => {
    return includes(collectedTimeRange.value, dayjs(date).format('YYYY-MM-DD'))
      ? markCellStyle
      : {};
  };
  const handleDateChange = (val) => {
    console.log('dateChange=1==', val, queryParams);
    dailyCostFilters.value = {
      ...dailyCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    clusterCostFilters.value = {
      ...clusterCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    getDailyCostChart();
    getProjectCostChart();
    getClusterCostChart();
    getSummaryData();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    getSummaryData();
    getDailyCostChart();
    getProjectCostChart();
    getClusterCostChart();
    setTimeout(() => {
      loadeend.value = true;
    }, 50);
  };
  watch(
    () => props.viewId,
    (ov) => {
      if (ov && props.source === 'all') {
        initData();
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  // onBeforeRouteUpdate(() => {
  //   if (props.viewId && props.source === 'all') {
  //     initData();
  //   }
  // });
  onMounted(() => {
    // initData();
  });
</script>

<style></style>
