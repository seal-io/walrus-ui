import { ref, reactive, computed, toRefs } from 'vue';
import dayjs from 'dayjs';
import useCallCommon from '@/hooks/use-call-common';
import { find, get, omit, map, each, assignIn } from 'lodash';
import { CostAnalyRow, ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryAllPerspectiveSummary
} from '../api';
import { costOverview, getTimeRange } from '../config';
import testData, { overviewData } from '../config/testData';

export default function usePerspectiveCost(props) {
  const { route } = useCallCommon();
  const { query } = route;
  const dailyCostFilters = ref<any>({});
  const projectCostFilters = ref<any>({});
  const clusterCostFilters = ref<any>({});

  const dailyloading = ref(false);
  const projectloading = ref(false);
  const clusterloading = ref(false);
  const overviewloading = ref(false);
  const loading = ref(false);

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
    return query.id || props.viewId;
  });
  const summaryData = computed(() => {
    const list = map(costOverview, (item) => {
      item.value = get(overData.value, item.key) || 0;
      return item;
    });
    return list;
  });
  const getSummaryData = async () => {
    try {
      overviewloading.value = true;
      const params = {
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryAllPerspectiveSummary(params);
      overData.value = data || {};
      overviewloading.value = false;
    } catch (error) {
      overviewloading.value = false;
      overData.value = {};
      console.log(error);
    }
  };
  const getDailyCostChart = async () => {
    try {
      dailyloading.value = true;
      const params = {
        ...omit(dailyCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
      // const list = testData;
      dailyCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      const values: number[] = [];
      each(list, (item, index) => {
        const arr: any[] = [];
        arr[index] = item.totalCost;
        const d = dayjs(item.startTime).format('YYYY-MM-DD');
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
      console.log(error);
    }
  };
  const getProjectCostChart = async () => {
    try {
      projectloading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
      // const list = testData;
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
      console.log(error);
    }
  };
  const getClusterCostChart = async () => {
    try {
      clusterloading.value = true;
      const params = {
        ...omit(clusterCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
      // const list = testData;
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
      console.log(error);
    }
  };
  const getPerspectiveItemInfo = async () => {
    try {
      loading.value = true;
      const id = route.query.id || props.viewId;
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
        (item) => item.groupBy === 'label:seal.io/project'
      );
      const clusterFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'cluster_name'
      );
      dailyCostFilters.value = {
        ...dailyFilter,
        ...queryParams
      };
      projectCostFilters.value = {
        ...projectFilter,
        ...queryParams
      };
      clusterCostFilters.value = {
        ...clusterFilter,
        ...queryParams
      };
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
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
    overviewloading
  };
}
