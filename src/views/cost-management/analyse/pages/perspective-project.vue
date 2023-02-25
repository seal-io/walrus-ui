<template>
  <div class="container">
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 10px"
    >
      <a-select
        v-model="queryParams.project"
        :placeholder="$t('cost.analyse.project.holder')"
        class="border-less"
        style="width: 200px"
        :options="projectList"
        @change="handleProjectChange"
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
    <SpinCard :title="projectName" borderless style="margin-bottom: 10px">
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
              <span>{{ round(item.value, 3) }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
      <!-- <a-grid :cols="24" :col-gap="20" style="margin-top: 10px">
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
      </a-grid> -->
    </SpinCard>
    <SpinCard title="应用消费金额" borderless style="margin-bottom: 10px">
      <LineBarChart
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
        :columns="projectCostCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { set, get, find, map, each, round } from 'lodash';
  import { reactive, ref, computed, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    clusterCostOverview,
    resourceCostOverview,
    projectCostCols,
    DateShortCuts
  } from '../config';
  import usePerspectiveProject from '../hooks/use-perspective-project';

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
    getProjectList,
    projectList,
    projectCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams
  } = usePerspectiveProject();
  const { t } = useCallCommon();
  const clusterOptions = [
    { label: 'project-1', value: 'project1' },
    { label: 'project-2', value: 'project' }
  ];
  const handleDateChange = async () => {
    await getProjectList();
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams
    };
    getProjectCostChart();
    getSummaryData();
  };
  const handleProjectChange = (val) => {
    const projectData = find(projectList.value, (item) => item.value === val);
    projectName.value = projectData?.label || 'Project';
    each(get(projectCostFilters.value, 'filters') || [], (fItem) => {
      each(fItem, (sItem) => {
        sItem.values = [val];
      });
    });
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams
    };
    getProjectCostChart();
    getSummaryData();
  };
  const initData = async () => {
    await getPerspectiveItemInfo();
    await getProjectList();
    getSummaryData();
    getProjectCostChart();
  };
  onMounted(() => {
    initData();
  });
</script>

<style></style>
