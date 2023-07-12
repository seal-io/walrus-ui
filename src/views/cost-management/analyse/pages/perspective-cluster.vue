<template>
  <div>
    <FilterBox style="margin-bottom: 8px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <a-select
          v-if="isPage"
          v-model="queryParams.connectorID"
          :format-label="formatLabel"
          allow-search
          :placeholder="$t('cost.analyse.cluster.holder')"
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
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeMode="timeMode"
          step="day"
          :short-cuts="DateShortCuts"
          :show-extra="true"
          timezone
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
        <a-select
          v-if="!isPage"
          v-model="queryParams.connectorID"
          :placeholder="$t('cost.analyse.cluster.holder')"
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
    <!-- <FilterBox style="margin-bottom: 8px">
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
      :title="`${$t('cost.analyse.detail.cluster')}: ${clusterName}`"
      borderless
      style="margin-bottom: 8px"
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
        :time-mode="timeMode"
        :request-work="requestWork"
        :filter-params="dailyCostFilters"
        :loadeend="loadeend"
        :columns="dailyColumns"
        source="daily table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard
      :title="$t('cost.analyse.table.namespaceCost')"
      borderless
      style="margin-bottom: 8px"
    >
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <span>{{ $t('cost.analyse.table.namespaceCost') }}</span>
          <a-select
            v-model="namespaceFilterKey"
            style="width: 200px"
            @change="handleNamespaceFilterChange"
          >
            <a-option
              v-for="(item, index) in workloadCostFilterKeys"
              :key="index"
              :value="item.dataIndex"
              :label="$t(item.title)"
            ></a-option>
          </a-select>
        </div>
      </template>
      <div style="max-height: 600px; overflow-y: auto">
        <horizontalBar
          :loading="spaceloading || preloading"
          style="flex: 1"
          :config-options="BarConfigOptions"
          :height="`${(nameSpaceCostChart?.bar?.length || 10) * 25}px`"
          :data-list="nameSpaceCostChart.bar"
        ></horizontalBar>
      </div>
      <TableList
        :request-work="requestWork"
        :time-mode="timeMode"
        :loadeend="loadeend"
        :filter-params="nameSpaceCostFilters"
        :columns="namespaceCostCols"
        source="namespace table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard
      :title="$t('cost.analyse.table.workloadCost')"
      borderless
      style="position: relative; margin-bottom: 10px"
    >
      <LineBarChart
        :loading="workloading || preloading"
        height="300px"
        show-type="line"
        :line-list="workloadCostChart.line"
        :data-config="workloadCostChart.dataConfig"
        :x-axis="workloadCostChart.xAxis"
        :config-options="{
          title: {
            ...title
          },
          legend: {
            right: 'auto',
            top: 0,
            show: workloadCostChart.line?.length < 5
          },
          grid: {
            ...grid,
            top: 45
          }
        }"
      >
        <template #filter>
          <a-select
            v-model="filterKey"
            style="width: 200px"
            @change="handleFilterChange"
          >
            <a-option
              v-for="(item, index) in workloadCostFilterKeys"
              :key="index"
              :value="item.dataIndex"
              :label="$t(item.title)"
            ></a-option>
          </a-select>
        </template>
      </LineBarChart>
      <TableList
        :filter-params="workloadCostFilters"
        :request-work="requestWork"
        :time-mode="timeMode"
        :loadeend="loadeend"
        :columns="workLoadCostCols"
        source="workload table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import {
    filter,
    includes,
    find,
    get,
    each,
    round,
    cloneDeep,
    map,
    sortBy
  } from 'lodash';
  import { reactive, ref, computed, onMounted, watch, inject } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import horizontalBar from '@/components/bar-chart/horizontal-bar.vue';
  import { getStackLineData } from '@/views/config';
  import TableList from '../components/table-list.vue';
  import {
    clusterCostOverview,
    resourceCostOverview,
    dailyCostCols,
    clusterNamespaceCostCols,
    DateShortCuts,
    setEndTimeAddDay
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
    setFilterModelValue,
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
    overviewloading,
    timeMode,
    overData,
    workloadDataList,
    collectedTimeRange,
    namespaceDataList
  } = usePerspectiveCost(props);
  const markCellStyle = {
    border: '1px solid rgb(var(--arcoblue-6))'
  };
  const { t, route } = useCallCommon();
  const loadeend = ref(false);
  const namespaceFilterKey = ref('totalCost');
  const clusterOptions = [];
  const active = ref<'bar' | 'line'>('bar');
  const filterKey = ref('totalCost');
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
  const dailyColumns = computed(() => {
    const list = cloneDeep(dailyCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const namespaceCostCols = computed(() => {
    const list = cloneDeep(clusterNamespaceCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const workLoadCostCols = computed(() => {
    const list = cloneDeep(clusterNamespaceCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const workloadCostFilterKeys = computed(() => {
    const list = cloneDeep(clusterNamespaceCostCols);
    const resList = filter(list, (item) => {
      return item.dataIndex !== 'itemName';
    });
    return resList;
  });
  const requestWork = computed(() => {
    return !!queryParams.connectorID;
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
  const handleNamespaceFilterChange = (key) => {
    each(namespaceDataList.value, (s) => {
      s[key] = s[key] ?? 0;
    });
    const list = sortBy(namespaceDataList.value, (s) => s[key]).reverse();
    const xAxis: string[] = [];
    const bar: Array<{ name: string; value: string }> = [];
    each(list, (item) => {
      // values.push(item.totalCost);
      xAxis.push(item.itemName);
      bar.push({
        name: item.itemName,
        value: get(item, key) || 0
      });
    });
    bar.reverse();
    nameSpaceCostChart.value.xAxis = [].concat(xAxis as never[]);
    nameSpaceCostChart.value.bar = [].concat(bar as never[]);
  };
  const handleFilterChange = (key) => {
    const result = getStackLineData({
      list: workloadDataList.value,
      key,
      step: workloadCostFilters.value.step
    });
    workloadCostChart.value = result;
  };
  const getCellStyle = (date) => {
    return includes(collectedTimeRange.value, dayjs(date).format('YYYY-MM-DD'))
      ? markCellStyle
      : {};
  };
  const formatLabel = (val) => {
    const d = find(clusterList.value, (item) => item.value === val);
    return d ? d.label : clusterName.value;
  };
  const handleDateChange = async (val) => {
    console.log('date===', val);

    workloadCostFilters.value = {
      ...workloadCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    dailyCostFilters.value = {
      ...dailyCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    nameSpaceCostFilters.value = {
      ...nameSpaceCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    await getClusterList(true);
    getDailyCostChart();
    getNamespaceCostChart();
    getSummaryData();
    getWorkloadCostChart();
  };
  const handleClusterChange = (val) => {
    const clusterData = find(clusterList.value, (item) => item.value === val);
    clusterName.value = clusterData?.label || 'Cluster';

    setFilterModelValue(dailyCostFilters.value, val);
    setFilterModelValue(workloadCostFilters.value, val);
    setFilterModelValue(nameSpaceCostFilters.value, val);

    workloadCostFilters.value = {
      ...workloadCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    dailyCostFilters.value = {
      ...dailyCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    nameSpaceCostFilters.value = {
      ...nameSpaceCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    getDailyCostChart();
    getNamespaceCostChart();
    getSummaryData();
    getWorkloadCostChart();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    await getClusterList();
    console.log('connenctID:', queryParams.connectorID);
    setFilterModelValue(dailyCostFilters.value, queryParams.connectorID);
    setFilterModelValue(workloadCostFilters.value, queryParams.connectorID);
    setFilterModelValue(nameSpaceCostFilters.value, queryParams.connectorID);
    getDailyCostChart();
    getNamespaceCostChart();
    getSummaryData();
    getWorkloadCostChart();
    setTimeout(() => {
      loadeend.value = true;
    }, 50);
  };
  watch(
    () => props.viewId,
    (ov) => {
      if (ov && props.source === 'cluster') {
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

<style lang="less" scoped>
  .data-key-filter {
    position: absolute;
    z-index: 100;
  }
</style>
