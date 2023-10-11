<template>
  <div>
    <FilterBox style="margin-bottom: 8px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <div v-if="isPage">
          <a-select
            v-model="queryParams.project"
            allow-search
            :format-label="formatLabel"
            :placeholder="$t('cost.analyse.project.holder')"
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
        </div>
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
          v-model="queryParams.project"
          :placeholder="$t('cost.analyse.project.holder')"
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
        <div><slot name="view-btn"></slot></div>
      </template>
    </FilterBox>

    <SpinCard
      :loading="overviewloading || preloading"
      :title="`${$t('cost.analyse.detail.project')}: ${projectName}`"
      borderless
      style="margin-bottom: 8px"
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
      style="margin-bottom: 8px"
    >
      <template #title>
        <div style="display: flex; justify-content: space-between">
          <div>{{ $t('cost.analyse.detail.costtrend') }}</div>
          <ChartBtn v-model:active="active"></ChartBtn>
        </div>
      </template>
      <LineBarChart
        :loading="overviewloading || preloading"
        height="220px"
        :show-type="active"
        :line-list="dailyCostChart.line"
        :bar-list="dailyCostChart.bar"
        :data-config="dailyCostChart.dataConfig"
        :x-axis="dailyCostChart.xAxis"
        :config-options="{
          title: {
            ...title
          },
          legend: {
            show: false,
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
        :time-mode="timeMode"
        :request-work="requestWork"
        :filter-params="projectDailyCostFilters"
        :loadeend="loadeend"
        :columns="dailyColumns"
        source="daily table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard
      :title="$t('cost.analyse.detail.appCost')"
      borderless
      style="margin-bottom: 8px"
    >
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
        :request-work="requestWork"
        time-range="single"
        :time-mode="timeMode"
        :loadeend="loadeend"
        :filter-params="projectCostFilters"
        :columns="projectCostColsList"
        source="app table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import {
    set,
    get,
    find,
    map,
    each,
    round,
    cloneDeep,
    template,
    includes
  } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, computed, onMounted, watch, inject } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import ChartBtn from '@/components/chart-btn/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    dailyCostCols,
    projectCostCols,
    DateShortCuts,
    setEndTimeAddDay
  } from '../config';
  import usePerspectiveProject from '../hooks/use-perspective-project';

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
    getProjectList,
    getProjectDailyCostChart,
    dailyCostChart,
    projectList,
    projectCostFilters,
    projectDailyCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams,
    projectloading,
    apploading,
    loading,
    overviewloading,
    timeMode,
    collectedTimeRange
  } = usePerspectiveProject(props);
  const { t, route } = useCallCommon();
  const active = ref<'bar' | 'line'>('bar');
  const loadeend = ref(false);

  const markCellStyle = {
    border: '1px solid rgb(var(--arcoblue-6))'
  };

  const dailyColumns = computed(() => {
    const list = cloneDeep(dailyCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });

  const preloading = computed(() => {
    return projectloading.value || loading.value;
  });
  const projectCostColsList = computed(() => {
    const list = cloneDeep(projectCostCols);
    return map(list, (item) => {
      item.title = t(item.title);
      return item;
    });
  });
  const requestWork = computed(() => {
    return !!queryParams.project;
  });
  const getCellStyle = (date) => {
    return includes(collectedTimeRange.value, dayjs(date).format('YYYY-MM-DD'))
      ? markCellStyle
      : {};
  };
  const formatLabel = (val) => {
    const d = find(projectList.value, (item) => item.value === val);
    return d ? d.label : projectName.value;
  };

  const handleProjectChange = (val) => {
    queryParams.project = val;
    const projectData = find(projectList.value, (item) => item.value === val);
    projectName.value = projectData?.label || '';
    // group by service
    each(get(projectCostFilters.value, 'filters') || [], (fItem) => {
      each(fItem, (sItem) => {
        sItem.values = [val];
      });
    });

    // group by day
    each(get(projectDailyCostFilters.value, 'filters') || [], (fItem) => {
      each(fItem, (sItem) => {
        sItem.values = [val];
      });
    });
    projectCostFilters.value = {
      ...projectCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    projectDailyCostFilters.value = {
      ...projectDailyCostFilters.value,
      ...queryParams,
      endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
    };
    getProjectCostChart();
    getProjectDailyCostChart();
    getSummaryData();
  };

  const handleDateChange = async () => {
    handleProjectChange(queryParams.project);
  };

  const initData = async () => {
    await getPerspectiveItemInfo();
    await getProjectList();
    handleProjectChange(get(projectList.value, '0.value'));
    setTimeout(() => {
      loadeend.value = true;
    }, 50);
  };

  watch(
    () => props.viewId,
    (ov) => {
      if (ov && props.source === 'project') {
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
