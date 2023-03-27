<template>
  <div class="container">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeMode="timeMode"
          :show-extra="true"
          timezone
          :short-cuts="DateShortCuts"
          today-in
          border-less
          @change="handleDateChange"
        ></DateRange>
        <div><slot name="button"></slot></div>
      </template>
      <template #button-group>
        <div><slot name="view-btn"></slot></div>
      </template>
    </FilterBox>
    <SpinCard
      title="所有资源"
      borderless
      style="margin-bottom: 10px"
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
    <SpinCard title="消费趋势" borderless style="margin-bottom: 10px">
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>消费趋势</div>
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
        :columns="dailyCostCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Project Cost================ -->
    <SpinCard title="项目消费分布" borderless style="margin-bottom: 10px">
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
        :columns="costPerProjectCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Cluster Cost================ -->
    <SpinCard title="集群消费分布" borderless style="margin-bottom: 10px">
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
        :columns="costPerClusterCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { round } from 'lodash';
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
    timeMode
  } = usePerspectiveCost(props);
  const { route } = useCallCommon();
  const active = ref<'bar' | 'line'>('bar');
  const activeProject = ref<'bar' | 'line'>('bar');
  const activeCluster = ref<'bar' | 'line'>('bar');
  const loadeend = ref(false);

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
  // watch(
  //   () => route.query.id,
  //   (ov) => {
  //     if (ov && route.query.page === 'all') {
  //       initData();
  //     }
  //   },
  //   {
  //     immediate: true
  //   }
  // );
  watch(
    () => route.query,
    (ov) => {
      if (route.query.id && route.query.page === 'all') {
        console.log('route.quert===', route.query);
        initData();
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  onBeforeRouteUpdate(() => {
    if (route.query.id && route.query.page === 'all') {
      initData();
    }
  });
  onMounted(() => {
    // if (!props.isPage || props.viewId) {
    //   initData();
    // }
  });
</script>

<style></style>
