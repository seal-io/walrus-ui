import { ref, reactive, computed, toRefs } from 'vue';
import dayjs from 'dayjs';
import useCallCommon from '@/hooks/use-call-common';
import {
  find,
  get,
  omit,
  map,
  each,
  assignIn,
  sortBy,
  cloneDeep
} from 'lodash';
import { CostAnalyRow, ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryAllPerspectiveSummary
} from '../api';
import { costOverview, getTimeRange, setEndTimeAddDay } from '../config';

export default function usePerspectiveCost(props) {
  const { route, t } = useCallCommon();
  const { query } = route;
  const dailyCostFilters = ref<any>({});
  const projectCostFilters = ref<any>({});
  const clusterCostFilters = ref<any>({});

  const dailyloading = ref(false);
  const projectloading = ref(false);
  const clusterloading = ref(false);
  const overviewloading = ref(false);
  const loading = ref(false);
  const timeMode = ref('utc');
  const collectedTimeRange = ref<string[]>([]);

  const dailyCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });
  const projectCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });
  const clusterCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });

  const queryParams = reactive({
    startTime: '',
    endTime: ''
  });

  const overData = ref({});
  const pageId = computed(() => {
    return props.viewId;
  });
  const summaryData = computed(() => {
    const arr = cloneDeep(costOverview);
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
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      const { data } = await queryAllPerspectiveSummary(params);
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
  const getDailyCostChart = async () => {
    try {
      dailyloading.value = true;
      const params = {
        ...omit(dailyCostFilters.value, 'paging'),
        source: 'daily chart'
      };
      const { data } = await queryPerspectiveData(params);
      let list = data?.items || [];
      list = sortBy(list, (s) => s.itemName);
      dailyCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      const values: number[] = [];
      each(list, (item, index) => {
        const arr: any[] = [];
        arr[index] = item.totalCost;
        const d = dayjs(item.itemName).format('YYYY-MM-DD');
        dailyCostChart.value.xAxis.push(d);
        dailyCostChart.value.bar.push({
          name: d,
          value: [item.totalCost]
        });
        values.push(item.totalCost);
      });
      dailyCostChart.value.line = [{ name: 'cost', value: values }];
      dailyCostChart.value.dataConfig = [{ name: 'cost', label: 'dailycost' }];
      dailyloading.value = false;
    } catch (error) {
      dailyloading.value = false;
      dailyCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
    }
  };
  const getProjectCostChart = async () => {
    try {
      projectloading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
      const values: number[] = [];
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      each(list, (item) => {
        values.push(item.totalCost);
        projectCostChart.value.xAxis.push(item.itemName);
        projectCostChart.value.bar.push({
          name: item.itemName,
          value: [item.totalCost]
        });
      });
      projectCostChart.value.dataConfig = [
        { name: 'cost', label: 'projectCost' }
      ];
      projectCostChart.value.line = [{ name: 'cost', value: values }];
      projectloading.value = false;
    } catch (error) {
      projectloading.value = false;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
    }
  };
  const getClusterCostChart = async () => {
    try {
      clusterloading.value = true;
      const params = {
        ...omit(clusterCostFilters.value, 'paging')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
      const values: number[] = [];
      clusterCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      each(list, (item) => {
        values.push(item.totalCost);
        clusterCostChart.value.xAxis.push(item.itemName);
        clusterCostChart.value.bar.push({
          name: item.itemName,
          value: [item.totalCost]
        });
      });
      clusterCostChart.value.dataConfig = [
        { name: 'cost', label: 'clusterCost' }
      ];
      clusterCostChart.value.line = [{ name: 'cost', value: values }];
      clusterloading.value = false;
    } catch (error) {
      clusterloading.value = false;
      clusterCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
    }
  };
  const getPerspectiveItemInfo = async () => {
    if (!pageId.value) return;
    try {
      loading.value = true;
      const id = pageId.value;
      const { data } = await queryItemPerspective({ id });
      const allocationQueries = get(data, 'allocationQueries') || [];

      const startTime = get(data, 'startTime');
      const timeRange = getTimeRange(startTime) || [];
      queryParams.startTime = get(timeRange, '0');
      queryParams.endTime = get(timeRange, '1');

      const dailyFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'day'
      );
      const projectFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'label:seal.io/project-name'
      );
      const clusterFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'connector_id'
      );
      dailyCostFilters.value = {
        ...dailyFilter,
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value),
        step: ''
      };
      projectCostFilters.value = {
        ...projectFilter,
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      clusterCostFilters.value = {
        ...clusterFilter,
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
    getDailyCostChart,
    getProjectCostChart,
    getClusterCostChart,
    getSummaryData,
    dailyCostFilters,
    projectCostFilters,
    clusterCostFilters,
    dailyCostChart,
    projectCostChart,
    clusterCostChart,
    summaryData,
    queryParams,
    dailyloading,
    projectloading,
    clusterloading,
    id: pageId,
    loading,
    overviewloading,
    timeMode,
    collectedTimeRange
  };
}
