<template>
  <div class="container">
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 10px"
    >
      <a-select
        v-model="queryParams.query"
        :placeholder="$t('cost.analyse.cluster.holder')"
        class="border-less"
        style="width: 200px"
        :options="clusterOptions"
        @change="handleSearch"
      >
        <template #option="{ data }">
          <a-tooltip :content="data.label" position="top">
            <span
              ><ProviderIcon :provider="data.provider" /><span
                style="margin-left: 5px"
                >{{ data.label }}</span
              ></span
            >
          </a-tooltip>
        </template>
      </a-select>
      <dateRange
        v-model:start="queryParams.startTime"
        v-model:end="queryParams.endTime"
        :show-extra="false"
        :short-cuts="DateShortCuts"
        today-in
        border-less
        @change="handleSearch"
      ></dateRange>
    </div>
    <!-- <FilterBox style="margin-bottom: 10px">
      <template #params>
        <dateRange
          v-model:start="queryParams.start"
          v-model:end="queryParams.end"
          :show-extra="false"
          today-in
          border-less
          @change="handleSearch"
        ></dateRange>
        <a-select
          :placeholder="$t('cost.analyse.cluster.holder')"
          v-model="queryParams.cluster"
          class="border-less"
          style="width: 200px"
          :options="clusterOptions"
          @change="handleSearch"
        >
          <template #option="{ data }">
            <a-tooltip :content="data.label" position="top">
              <span
                ><ProviderIcon :provider="data.provider" /><span
                  style="margin-left: 5px"
                  >{{ data.label }}</span
                ></span
              >
            </a-tooltip>
          </template>
        </a-select>
        <a-space style="margin-left: 10px">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
    </FilterBox> -->
    <SpinCard title="My Cluster" borderless style="margin-bottom: 10px">
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in clusterCostOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
      <a-grid :cols="24" :col-gap="20" style="margin-top: 10px">
        <a-grid-item
          v-for="(item, index) in resourceCostOverview"
          :key="index"
          :span="{ lg: 6, md: 6, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="linear-gradient(rgba(255, 197, 192,.3) 0%,rgba(255, 197, 192,.4) 100%)"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
    </SpinCard>
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
        :line-list="dailyCostChart.line"
        :bar-list="dailyCostChart.bar"
        :data-config="dailyCostChart.dataConfig"
        :x-axis="dailyCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList :columns="dailyCostCols" style="margin-top: 20px"></TableList>
    </SpinCard>
    <SpinCard title="Namespace消费记录" borderless style="margin-bottom: 10px">
      <horizontalBar
        style="flex: 1"
        :config-options="BarConfigOptions"
        height="260px"
        :data-list="nameSpaceCostChart.bar"
      ></horizontalBar>
      <TableList
        :columns="namespaceCostCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard title="工作负载消费金额" borderless style="margin-bottom: 10px">
      <LineBarChart
        height="220px"
        show-type="line"
        :line-list="[]"
        :data-config="workloadCostChart.dataConfig"
        :x-axis="workloadCostChart.xAxis"
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
        :columns="workLoadCostCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { filter } from 'lodash';
  import { reactive, ref, computed, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import horizontalBar from '@/components/bar-chart/horizontal-bar.vue';
  import TableList from '../components/table-list.vue';
  import {
    clusterCostOverview,
    resourceCostOverview,
    dailyCostCols,
    clusterNamespaceCostCols,
    DateShortCuts
  } from '../config';
  import usePerspectiveCost from '../hooks/use-perspective-cluster';

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
    right: 0,
    top: 20,
    bottom: 0,
    containLabel: true
  };
  const {
    getPerspectiveItemInfo,
    getDailyCostChart,
    getWorkloadCostChart,
    getNamespaceCostChart,
    dailyCostFilters,
    workloadCostFilters,
    nameSpaceCostFilters,
    dailyCostChart,
    workloadCostChart,
    nameSpaceCostChart,
    queryParams
  } = usePerspectiveCost();
  const { t } = useCallCommon();
  const clusterOptions = [
    { label: 'cluster-1', value: 'cluster1' },
    { label: 'cluster-2', value: 'cluster2' }
  ];
  const active = ref<'bar' | 'line'>('bar');

  const dataList = ref([
    { name: '一', value: [1] },
    { name: '二', value: [2] },
    { name: '三', value: [3] },
    { name: '四', value: [4] },
    { name: '五', value: [5] },
    { name: '六', value: [6] },
    { name: '七', value: [7] },
    { name: '八', value: [8] },
    { name: '九', value: [9] },
    { name: '十', value: [10] }
  ]);
  const barDataList = ref([
    { name: '一', value: 1 },
    { name: '二', value: 2 },
    { name: '三', value: 3 },
    { name: '四', value: 4 },
    { name: '五', value: 5 },
    { name: '六', value: 6 },
    { name: '七', value: 7 },
    { name: '八', value: 8 },
    { name: '九', value: 9 },
    { name: '十', value: 10 }
  ]);
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
  const BarConfigOptions = computed(() => {
    return {
      title: {
        ...title,
        top: 0
      },
      legend: {
        show: false
      },
      grid: {
        ...grid,
        top: 0,
        right: 20
      }
    };
  });
  const workLoadCostCols = computed(() => {
    return clusterNamespaceCostCols;
  });
  const namespaceCostCols = computed(() => {
    return filter(clusterNamespaceCostCols, (item) => !item.showIn);
  });
  const handleSearch = () => {
    workloadCostFilters.value = {
      ...workloadCostFilters.value,
      ...queryParams
    };
    dailyCostFilters.value = {
      ...dailyCostFilters.value,
      ...queryParams
    };
    nameSpaceCostFilters.value = {
      ...nameSpaceCostFilters.value,
      ...queryParams
    };
    getDailyCostChart();
    getNamespaceCostChart();
    // getWorkloadCostChart();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    getDailyCostChart();
    getNamespaceCostChart();
    // getWorkloadCostChart();
  };
  onMounted(() => {
    initData();
  });
</script>

<style></style>
