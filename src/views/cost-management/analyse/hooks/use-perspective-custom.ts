import { ref, reactive, computed } from 'vue';
import dayjs from 'dayjs';
import useCallCommon from '@/hooks/use-call-common';
import { find, get, omit, map, each, sortBy, cloneDeep } from 'lodash';
import { getStackLineData } from '@/views/config/utils';
import {
  getTimeRange,
  projectCostOverview,
  setEndTimeAddDay,
  dateFormatMap
} from '../config';
import { ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryCustomPerspectiveSummary
} from '../api';

export default function usePerspectiveCost(props) {
  const { route, t } = useCallCommon();
  const projectCostFilters = ref<any>({});
  const projectCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });
  const projectChartDataList = ref<any[]>([]);
  const loading = ref(false);
  const apploading = ref(false);
  const overviewloading = ref(false);
  const collectedTimeRange = ref<string[]>([]);

  const timeMode = ref('utc');

  const projectName = ref('');
  const queryParams = reactive({
    startTime: '',
    endTime: ''
  });

  const overData = ref({});
  const pageId = computed(() => {
    return props.viewId;
  });
  const summaryData = computed(() => {
    const arr = cloneDeep(projectCostOverview);
    const list = map(arr, (item) => {
      item.value = get(overData.value, item.key) || 0;
      item.label = t(item.label);
      return item;
    });
    return list;
  });

  const getSummaryData = async () => {
    try {
      overviewloading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime'),
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      const { data } = await queryCustomPerspectiveSummary(params);
      overData.value = data || {};
      overviewloading.value = false;
      collectedTimeRange.value = [];
      if (get(data, `collectedTimeRange.firstTime`)) {
        collectedTimeRange.value.push(
          dayjs(get(data, `collectedTimeRange.firstTime`)).format('YYYY-MM-DD')
        );
      }

      if (get(data, `collectedTimeRange.lastTime`)) {
        collectedTimeRange.value.push(
          dayjs(get(data, `collectedTimeRange.lastTime`)).format('YYYY-MM-DD')
        );
      }
    } catch (error) {
      overviewloading.value = false;
      overData.value = {};
    }
  };
  const setProjectCostChartData = ({ list, key = 'totalCost' }) => {
    const result: ChartData = { xAxis: [], line: [], bar: [], dataConfig: [] };
    if (get(dateFormatMap, projectCostFilters.value.groupBy)) {
      list = sortBy(list, (s) => s.itemName);
    }
    each(list, (item) => {
      const itemName = get(dateFormatMap, projectCostFilters.value.groupBy)
        ? dayjs(item.itemName).format(
            get(dateFormatMap, projectCostFilters.value.groupBy)
          )
        : item.itemName;
      result.xAxis.push(itemName);
      result.bar.push({
        name: itemName,
        value: get(item, key)
      });
    });
    return result;
  };
  const getProjectCostChart = async () => {
    try {
      apploading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime')
      };
      const { data } = await queryPerspectiveData(params);
      // const data = namespaceData;
      const list = map(data?.items || [], (s) => {
        s.totalCost = s.totalCost || 0;
        return s;
      });

      // let list = statckLineData;
      projectChartDataList.value = list;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      if (!projectCostFilters.value.step) {
        const result = setProjectCostChartData({ list, key: 'totalCost' });
        projectCostChart.value = result;
      } else {
        const result = getStackLineData({
          list,
          step: projectCostFilters.value.step
        });
        projectCostChart.value = result;
      }
      apploading.value = false;
    } catch (error) {
      projectChartDataList.value = [];
      apploading.value = false;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
    }
  };

  const getPerspectiveItemInfo = async () => {
    if (!pageId.value) return;
    try {
      loading.value = true;
      const id = pageId.value;
      const { data } = await queryItemPerspective({ id });
      projectName.value = get(data, 'name') || 'Custom';
      const allocationQueries = get(data, 'costQueries') || [];
      const startTime = get(data, 'startTime');
      const timeRange = getTimeRange(startTime) || [];
      queryParams.startTime = get(timeRange, '0');
      queryParams.endTime = get(timeRange, '1');
      const projectFilter = get(allocationQueries, '0') || {};

      projectCostFilters.value = {
        ...projectFilter,
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  return {
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
    id: pageId,
    loading,
    overviewloading,
    timeMode,
    collectedTimeRange,
    projectChartDataList
  };
}
