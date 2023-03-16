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
        ></DateRange>
        <div><slot name="button"></slot></div>
      </template>
      <template #button-group>
        <div><slot name="view-btn"></slot></div>
      </template>
    </FilterBox>
    <SpinCard
      :loading="overviewloading || preloading"
      :title="`自定义: ${projectName}`"
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
    <SpinCard title="消费趋势" borderless style="margin-bottom: 10px">
      <LineBarChart
        :loading="apploading || preloading"
        height="220px"
        show-type="line"
        :line-list="projectCostChart.line"
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
        :filter-params="{
          ...projectCostFilters
        }"
        :columns="customTableCols"
        source="project"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { set, get, find, map, each, round } from 'lodash';
  import { reactive, ref, computed, onMounted, watch } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '../components/table-list.vue';
  import { DateShortCuts, setEndTimeAddDay } from '../config';
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
    timeMode
  } = usePerspectiveCost(props);
  const { t } = useCallCommon();
  const loadeend = ref(false);

  const preloading = computed(() => {
    return loading.value;
  });
  const customTableCols = computed(() => {
    const groupBy = find(groupbyData, (item) => {
      return item.fieldName === get(projectCostFilters.value, 'groupBy');
    });
    return [
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'itemName',
        title: groupBy?.title || '名称'
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
        title: '内存'
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
        dataIndex: 'sharedCost',
        render({ record }) {
          return round(record.sharedCost, 4) || 0;
        },
        title: '共享资源费用'
      },
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'totalCost',
        render({ record }) {
          return round(record.totalCost, 4) || 0;
        },
        title: '消费金额'
      }
    ];
  });
  const handleDateChange = async () => {
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
    loadeend.value = true;
    getSummaryData();
    getProjectCostChart();
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
