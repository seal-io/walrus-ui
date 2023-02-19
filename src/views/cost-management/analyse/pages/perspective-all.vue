<template>
  <div class="container">
    <dateRange
      v-model:start="queryParams.start"
      v-model:end="queryParams.end"
      :show-extra="false"
      style="margin-bottom: 10px"
      today-in
      border-less
    ></dateRange>
    <SpinCard title="All Resource" borderless style="margin-bottom: 10px">
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in costOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            :bg-color="item.color"
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
        :data-list="dataList"
        :data-config="dataConfig"
        :x-axis="xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList :columns="dailyCostCols" style="margin-top: 20px"></TableList>
    </SpinCard>
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
        :data-list="dataList"
        :data-config="dataConfig"
        :x-axis="xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :columns="costPerProjectCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
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
        :data-list="dataList"
        :data-config="dataConfig"
        :x-axis="xAxis"
        :config-options="configOptions"
      ></LineBarChart>
      <TableList
        :columns="costPerClusterCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    costOverview,
    dailyCostCols,
    costPerClusterCols,
    costPerProjectCols
  } from '../config';

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
  const { t } = useCallCommon();
  const active = ref<'bar' | 'line'>('bar');
  const activeProject = ref<'bar' | 'line'>('bar');
  const activeCluster = ref<'bar' | 'line'>('bar');
  const dataConfig = ref([
    { name: '一', label: '一', value: [1] },
    { name: '二', label: '二', value: [2] },
    { name: '三', label: '三', value: [3] },
    { name: '四', label: '四', value: [4] },
    { name: '五', label: '五', value: [5] },
    { name: '六', label: '六', value: [6] },
    { name: '七', label: '七', value: [7] },
    { name: '八', label: '八', value: [8] },
    { name: '九', label: '九', value: [9] },
    { name: '十', label: '十', value: [10] }
  ]);
  const xAxis = ref([
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十'
  ]);
  const queryParams = reactive({
    start: '',
    end: ''
  });

  const dataList = ref([
    { name: '一', value: [1] },
    { name: '二', value: [0, 2] },
    { name: '三', value: [3] },
    { name: '四', value: [4] },
    { name: '五', value: [5] },
    { name: '六', value: [6] },
    { name: '七', value: [7] },
    { name: '八', value: [8] },
    { name: '九', value: [9] },
    { name: '十', value: [10] }
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
</script>

<style></style>
