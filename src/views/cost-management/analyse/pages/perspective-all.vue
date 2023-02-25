<template>
  <div class="container">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px">
      <dateRange
        v-model:start="queryParams.startTime"
        v-model:end="queryParams.endTime"
        :show-extra="false"
        :short-cuts="DateShortCuts"
        today-in
        border-less
        @change="handleDateChange"
      ></dateRange>
    </div>
    <SpinCard title="All Resource" borderless style="margin-bottom: 10px">
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
              <span>{{ round(item.value, 3) }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
    </SpinCard>
    <!-- ===========Daily Cost================ -->
    <SpinCard title="Daily Cost" borderless style="margin-bottom: 10px">
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Daily Cost</div>
          <ChartBtn v-model:active="active"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        height="220px"
        :show-type="active"
        :bar-list="dailyCostChart.bar"
        :line-list="dailyCostChart.line"
        :data-config="dailyCostChart.dataConfig"
        :x-axis="dailyCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :filter-params="dailyCostFilters"
        :columns="dailyCostCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Project Cost================ -->
    <SpinCard title="Cost Per Project" borderless style="margin-bottom: 10px">
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Cost Per Project</div>
          <ChartBtn v-model:active="activeProject"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        height="220px"
        :show-type="activeProject"
        :bar-list="projectCostChart.bar"
        :line-list="projectCostChart.line"
        :data-config="projectCostChart.dataConfig"
        :x-axis="projectCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :filter-params="projectCostFilters"
        :columns="costPerProjectCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <!-- ===========Cluster Cost================ -->
    <SpinCard title="Cost Per Cluster" borderless style="margin-bottom: 10px">
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Cost Per Cluster</div>
          <ChartBtn v-model:active="activeCluster"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        height="220px"
        :show-type="activeCluster"
        :bar-list="clusterCostChart.bar"
        :line-list="clusterCostChart.line"
        :data-config="clusterCostChart.dataConfig"
        :x-axis="clusterCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
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
  import { reactive, ref, computed, onMounted } from 'vue';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    costOverview,
    dailyCostCols,
    costPerClusterCols,
    costPerProjectCols,
    DateShortCuts
  } from '../config';
  import usePerspectiveCost from '../hooks/use-perspective-cost';

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
    queryParams
  } = usePerspectiveCost();

  const active = ref<'bar' | 'line'>('bar');
  const activeProject = ref<'bar' | 'line'>('bar');
  const activeCluster = ref<'bar' | 'line'>('bar');

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
  const handleDateChange = () => {
    dailyCostFilters.value = {
      ...dailyCostFilters.value,
      ...queryParams
    };
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams
    };
    clusterCostFilters.value = {
      ...clusterCostFilters.value,
      ...queryParams
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
  };
  onMounted(() => {
    initData();
  });
</script>

<style></style>
