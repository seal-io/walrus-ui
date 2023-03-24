import { ref, reactive, computed } from 'vue';
import dayjs from 'dayjs';
import useCallCommon from '@/hooks/use-call-common';
import {
  find,
  get,
  omit,
  map,
  each,
  sortBy,
  reduce,
  cloneDeep,
  keys,
  concat,
  assignIn,
  uniq,
  uniqBy
} from 'lodash';
import { getStackLineData } from '@/views/config';
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
  queryCustomPerspectiveSummary,
  queryPerspectiveFieldValues
} from '../api';
import testData, { dailyCostData, namespaceData } from '../config/testData';

export default function usePerspectiveCost(props) {
  const { route } = useCallCommon();
  const { query } = route;
  const projectCostFilters = ref<any>({});
  const projectCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });

  const loading = ref(false);
  const apploading = ref(false);
  const overviewloading = ref(false);

  const timeMode = ref('utc');

  const projectName = ref('');
  const queryParams = reactive({
    startTime: '',
    endTime: ''
  });

  const overData = ref({});
  const pageId = computed(() => {
    return query.id || props.viewId;
  });
  const summaryData = computed(() => {
    const list = map(projectCostOverview, (item) => {
      item.value = get(overData.value, item.key) || 0;
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
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryCustomPerspectiveSummary(params);
      overData.value = data || {};
      overviewloading.value = false;
    } catch (error) {
      overviewloading.value = false;
      overData.value = {};
      console.log(error);
    }
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
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      if (!projectCostFilters.value.step) {
        each(list, (item) => {
          const itemName = get(dateFormatMap, projectCostFilters.value.groupBy)
            ? dayjs(item.itemName).format(
                get(dateFormatMap, projectCostFilters.value.groupBy)
              )
            : item.itemName;
          projectCostChart.value.xAxis.push(itemName);
          projectCostChart.value.bar.push({
            name: itemName,
            value: [item.totalCost]
          });
        });
      } else {
        const result = getStackLineData({
          list,
          step: projectCostFilters.value.step
        });
        projectCostChart.value = result;
      }
      console.log('projectCostChart===', projectCostChart.value);
      apploading.value = false;
    } catch (error) {
      apploading.value = false;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      console.log(error);
    }
  };

  const getPerspectiveItemInfo = async () => {
    if (!route.query.id) return;
    try {
      loading.value = true;
      const id = (route.query.id || '') as string;
      const { data } = await queryItemPerspective({ id });
      projectName.value = get(data, 'name') || 'Custom';
      const allocationQueries = get(data, 'allocationQueries') || [];
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
      console.log(error);
    }
  };
  return {
    getPerspectiveItemInfo,
    getProjectCostChart,
    getSummaryData,
    projectCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams,
    apploading,
    id: pageId,
    loading,
    overviewloading,
    timeMode
  };
}
