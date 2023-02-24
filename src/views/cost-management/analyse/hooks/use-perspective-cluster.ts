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
  keys,
  cloneDeep,
  assignIn
} from 'lodash';
import {
  clusterCostOverview,
  resourceCostOverview,
  getTimeRange
} from '../config';
import { CostAnalyRow, ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryClusterPerspectiveSummary,
  queryPerspectiveField
} from '../api';
import testData, { statckLineData } from '../config/testData';

export default function usePerspectiveCost() {
  const { route } = useCallCommon();
  const id = route.query.id as string;

  const dailyCostFilters = ref<any>({});
  const workloadCostFilters = ref<any>({});
  const nameSpaceCostFilters = ref<any>({});

  const dailyCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });

  const nameSpaceCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });
  const workloadCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });
  const clusterList = ref<{ label: string; value: string }[]>([]);
  const clusterName = ref('');
  const queryParams = reactive({
    startTime: '',
    endTime: '',
    connectorID: ''
  });

  const overData = reactive({});
  const summaryData = computed(() => {
    const list = map(clusterCostOverview, (item) => {
      item.value = get(summaryData, item.key) || 0;
      return item;
    });
    return list;
  });
  const resourceSummaryData = computed(() => {
    const list = map(resourceCostOverview, (item) => {
      item.value = get(summaryData, item.key);
      return item;
    });
    return list;
  });

  const getClusterList = async () => {
    try {
      const params = {
        ...omit(queryParams, ['connectorID']),
        fieldName: 'cluster_name'
      };
      const { data } = await queryPerspectiveField(params);
      clusterList.value = data?.items || [];
      queryParams.connectorID = get(clusterList.value, '0.value') || '';
      clusterName.value = get(clusterList.value, '0.label') || 'Cluster';

      each(dailyCostFilters.value, (vItem) => {
        each(get(vItem, 'filters') || [], (fItem) => {
          fItem.values = [queryParams.connectorID];
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getSummaryData = async () => {
    try {
      const params = {
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
      };
      const { data } = await queryClusterPerspectiveSummary(params);
      assignIn(overData, data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDailyCostChart = async () => {
    try {
      const params = {
        ...omit(dailyCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
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
    } catch (error) {
      dailyCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      console.log(error);
    }
  };

  const getNamespaceCostChart = async () => {
    try {
      const params = {
        ...omit(nameSpaceCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.item || [];
      // const list = testData;
      const values: number[] = [];
      nameSpaceCostChart.value = {
        xAxis: [],
        line: [],
        bar: [],
        dataConfig: []
      };
      each(list, (item) => {
        values.push(item.totalCost);
        nameSpaceCostChart.value.xAxis.push(item.itemName);
        nameSpaceCostChart.value.bar.push({
          name: item.itemName,
          value: [item.totalCost]
        });
      });
      nameSpaceCostChart.value.dataConfig = [
        { name: 'cost', label: 'projectCost' }
      ];
      nameSpaceCostChart.value.line = [{ name: 'cost', value: values }];
    } catch (error) {
      nameSpaceCostChart.value = {
        xAxis: [],
        line: [],
        bar: [],
        dataConfig: []
      };
      console.log(error);
    }
  };
  const getWorkloadCostChart = async () => {
    try {
      const params = {
        ...omit(workloadCostFilters.value, 'paging'),
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDTHH:mm:ssZ')
      };
      const { data } = await queryPerspectiveData(params);
      let list = data?.item || [];
      // let list = statckLineData;
      workloadCostChart.value = {
        xAxis: [],
        line: [],
        bar: [],
        dataConfig: []
      };
      list = sortBy(list, (d) => d.startTime);
      const dataObj = reduce(
        list,
        (obj, o) => {
          const item: any = {};
          each(keys(o), (key) => {
            if (key !== 'itemName') {
              item[key] = [o[key]];
            } else {
              item[key] = o[key];
            }
          });
          if (obj[item.itemName]) {
            each(keys(item), (k) => {
              if (k !== 'itemName') {
                obj[item.itemName][k] = [...obj[item.itemName][k], ...item[k]];
              }
            });
          } else {
            obj[item.itemName] = cloneDeep(item);
          }
          return obj;
        },
        {}
      );

      each(keys(dataObj), (pKey) => {
        workloadCostChart.value.line.push({
          name: pKey,
          value: dataObj[pKey]['totalCost']
        });
        workloadCostChart.value.dataConfig.push({
          name: pKey,
          label: pKey
        });
        workloadCostChart.value.xAxis = dataObj[pKey]['startTime'];
      });
      workloadCostChart.value.xAxis = map(
        workloadCostChart.value.xAxis,
        (kItem) => {
          return dayjs(kItem).format('YYYY.MM.DD');
        }
      );
    } catch (error) {
      workloadCostChart.value = {
        xAxis: [],
        line: [],
        bar: [],
        dataConfig: []
      };
      console.log(error);
    }
  };
  const getPerspectiveItemInfo = async () => {
    try {
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

      const workloadFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'namespace'
      );
      const namespaceFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'namespace'
      );
      dailyCostFilters.value = {
        ...dailyFilter,
        ...queryParams
      };

      workloadCostFilters.value = {
        ...workloadFilter,
        ...queryParams
      };
      nameSpaceCostFilters.value = {
        ...namespaceFilter,
        ...queryParams
      };
    } catch (error) {
      console.log(error);
    }
  };
  return {
    getPerspectiveItemInfo,
    getDailyCostChart,
    getWorkloadCostChart,
    getNamespaceCostChart,
    getSummaryData,
    getClusterList,
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
    queryParams
  };
}
