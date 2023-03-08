<template>
  <div class="container">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <a-select
          v-if="isPage"
          v-model="queryParams.connectorID"
          :placeholder="$t('cost.analyse.cluster.holder')"
          class="border-less"
          style="width: 200px"
          :options="clusterList"
          @change="handleClusterChange"
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
          <template #empty>
            <span></span>
          </template>
        </a-select>
        <dateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          :show-extra="false"
          :short-cuts="DateShortCuts"
          today-in
          border-less
          @change="handleDateChange"
        ></dateRange>
        <div><slot name="button"></slot></div>
      </template>
      <template #button-group>
        <a-select
          v-if="!isPage"
          v-model="queryParams.connectorID"
          :placeholder="$t('cost.analyse.cluster.holder')"
          class="border-less"
          style="width: 200px"
          :options="clusterList"
          @change="handleClusterChange"
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
          <template #empty>
            <span></span>
          </template>
        </a-select>
        <div><slot name="view-btn"></slot></div>
      </template>
    </FilterBox>
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
    <SpinCard
      :loading="overviewloading || preloading"
      :title="clusterName || 'Cluster'"
      borderless
      style="margin-bottom: 10px"
    >
      <a-grid :cols="15" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in summaryData"
          :key="index"
          :span="{ lg: 3, md: 3, sm: 5, xs: 15 }"
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
      <!-- <a-grid :cols="24" :col-gap="20" style="margin-top: 10px">
        <a-grid-item
          v-for="(item, index) in resourceSummaryData"
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
      </a-grid> -->
    </SpinCard>
    <SpinCard title="Daily Cost" borderless style="margin-bottom: 10px">
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>Daily Cost</div>
          <ChartBtn v-model:active="active"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        :loading="dailyloading || preloading"
        height="220px"
        :show-type="active"
        :line-list="dailyCostChart.line"
        :bar-list="dailyCostChart.bar"
        :data-config="dailyCostChart.dataConfig"
        :x-axis="dailyCostChart.xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :filter-params="{ ...dailyCostFilters }"
        :loadeend="loadeend"
        :columns="dailyCostCols"
        source="daily table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard title="Namespace消费记录" borderless style="margin-bottom: 10px">
      <horizontalBar
        :loading="spaceloading || preloading"
        style="flex: 1"
        :config-options="BarConfigOptions"
        height="260px"
        :data-list="nameSpaceCostChart.bar"
      ></horizontalBar>
      <TableList
        :filter-params="nameSpaceCostFilters"
        :columns="clusterNamespaceCostCols"
        source="namespace"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard title="工作负载消费金额" borderless style="margin-bottom: 10px">
      <LineBarChart
        :loading="workloading || preloading"
        height="220px"
        show-type="line"
        :line-list="workloadCostChart.line"
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
        :filter-params="{
          ...workloadCostFilters
        }"
        :columns="workLoadCostCols"
        source="workload"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { filter, find, get, each, round } from 'lodash';
  import { reactive, ref, computed, onMounted, watch } from 'vue';
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
    left: 0,
    right: 10,
    top: 20,
    bottom: 0,
    containLabel: true
  };
  const {
    getPerspectiveItemInfo,
    getDailyCostChart,
    getWorkloadCostChart,
    getNamespaceCostChart,
    getSummaryData,
    getClusterList,
    dailyCostFilters,
    workloadCostFilters,
    nameSpaceCostFilters,
    dailyCostChart,
    workloadCostChart,
    nameSpaceCostChart,
    summaryData,
    resourceSummaryData,
    clusterList,
    clusterName,
    queryParams,
    dailyloading,
    workloading,
    spaceloading,
    clusterloading,
    id,
    loading,
    overviewloading
  } = usePerspectiveCost(props);
  const { t } = useCallCommon();
  const loadeend = ref(false);
  const clusterOptions = [
    { label: 'cluster-1', value: 'cluster1' },
    { label: 'cluster-2', value: 'cluster2' }
  ];
  const active = ref<'bar' | 'line'>('bar');

  const preloading = computed(() => {
    return loading.value || clusterloading.value;
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
  // const namespaceCostCols = computed(() => {
  //   return filter(clusterNamespaceCostCols, (item) => !item.showIn);
  // });
  const handleDateChange = async () => {
    await getClusterList();
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
    getSummaryData();
    getWorkloadCostChart();
  };
  const handleClusterChange = (val) => {
    const clusterData = find(clusterList.value, (item) => item.value === val);
    clusterName.value = clusterData?.label || 'Cluster';

    each(get(dailyCostFilters.value, 'filters') || [], (fItem) => {
      each(fItem, (sItem) => {
        sItem.values = [val];
        fItem.fieldName = 'connector_id';
      });
    });
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
    getSummaryData();
    getWorkloadCostChart();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    await getClusterList();
    loadeend.value = true;
    getDailyCostChart();
    getNamespaceCostChart();
    getSummaryData();
    getWorkloadCostChart();
  };
  watch(
    () => id.value,
    () => {
      if (id.value) {
        initData();
      }
    },
    {
      immediate: true
    }
  );
  onMounted(() => {
    // initData();
  });
</script>

<style></style>
