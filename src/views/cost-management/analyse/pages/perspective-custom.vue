<template>
  <div>
    <FilterBox style="margin-bottom: 8px">
      <template #params>
        <div v-if="isPage"><slot name="select"></slot></div>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeMode="timeMode"
          :step="projectCostFilters.step || 'day'"
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
                <span>{{ $t('cost.analyse.datepicker.notes.title') }}</span>
                <div>{{ $t('cost.analyse.datepicker.notes.daily') }}</div>
                <span>{{ $t('cost.analyse.datepicker.notes.monthly') }}</span>
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
      :loading="overviewloading || preloading"
      :title="`${$t('cost.analyse.detail.custom')}: ${projectName}`"
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
      <LineBarChart
        :loading="apploading || preloading"
        height="260px"
        :show-type="projectCostFilters.step ? 'line' : 'bar'"
        :line-list="projectCostChart.line"
        :bar-list="projectCostChart.bar"
        :data-config="projectCostChart.dataConfig"
        :x-axis="projectCostChart.xAxis"
        :config-options="{
          title: {
            ...title
          },
          legend: {
            right: 'center',
            top: 0,
            show: projectCostChart.line?.length < 5
          },
          grid: {
            ...grid,
            top: 40
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
              v-for="(item, index) in optionsList"
              :key="index"
              :value="item.dataIndex"
            >
              <span>{{ $t(item.title) }}</span>
            </a-option>
          </a-select>
        </template>
      </LineBarChart>
      <TableList
        :request-work="true"
        time-range="single"
        :time-mode="timeMode"
        :loadeend="loadeend"
        :filter-params="projectCostFilters"
        :columns="customTableCols"
        source="cost table"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import {
    set,
    get,
    find,
    map,
    each,
    filter,
    cloneDeep,
    round,
    includes
  } from 'lodash';
  import { reactive, ref, computed, onMounted, watch } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import { getStackLineData } from '@/views/config/utils';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '../components/table-list.vue';
  import {
    DateShortCuts,
    setEndTimeAddDay,
    dateFormatMap,
    costTableCols
  } from '../config';
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
    setProjectCostChartData,
    projectCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams,
    apploading,
    loading,
    id,
    overviewloading,
    timeMode,
    projectChartDataList,
    collectedTimeRange
  } = usePerspectiveCost(props);
  const { t, route } = useCallCommon();
  const loadeend = ref(false);
  const optionsList = ref(cloneDeep(costTableCols));
  const filterKey = ref('totalCost');
  const markCellStyle = {
    border: '1px solid rgb(var(--arcoblue-6))'
  };
  const preloading = computed(() => {
    return loading.value;
  });
  const customTableCols = computed(() => {
    const groupBy = find(groupbyData, (item) => {
      return item.fieldName === get(projectCostFilters.value, 'groupBy');
    });
    const dfmt = get(dateFormatMap, projectCostFilters.value.groupBy);
    const list = [
      {
        ellipsis: true,
        tooltip: true,
        cellStyle: { minWidth: '40px' },
        dataIndex: 'itemName',
        title: groupBy?.title || 'cost.analyse.table.name',
        render({ record }) {
          if (dfmt) {
            return dayjs(record.itemName).format(dfmt);
          }
          return record.itemName;
        }
      },
      ...costTableCols
    ];
    return map(list, (sItem) => {
      sItem.title = t(sItem.title);
      return sItem;
    });
  });

  const handleFilterChange = (key) => {
    let result: any = {};
    if (!projectCostFilters.value.step) {
      result = setProjectCostChartData({
        list: projectChartDataList.value,
        key
      });
    } else {
      result = getStackLineData({
        list: projectChartDataList.value,
        key,
        step: projectCostFilters.value.step
      });
    }
    projectCostChart.value = result;
  };
  const getCellStyle = (date) => {
    return includes(collectedTimeRange.value, dayjs(date).format('YYYY-MM-DD'))
      ? markCellStyle
      : {};
  };
  const handleDateChange = async (values) => {
    queryParams.endTime = get(values, '1');
    queryParams.startTime = get(values, '0');
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
    getSummaryData();
    getProjectCostChart();
    setTimeout(() => {
      loadeend.value = true;
    }, 50);
  };

  watch(
    () => props.viewId,
    (ov) => {
      if (ov && props.source === 'custom') {
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
