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
  assignIn,
  concat
} from 'lodash';
import {
  clusterCostOverview,
  resourceCostOverview,
  getTimeRange,
  setEndTimeAddDay
} from '../config';
import { CostAnalyRow, ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryClusterPerspectiveSummary,
  queryPerspectiveFieldValues
} from '../api';
import testData, { statckLineData, overviewData } from '../config/testData';

export default function usePerspectiveCost(props) {
  const { route } = useCallCommon();
  const { query } = route;
  const dailyCostFilters = ref<any>({});
  const workloadCostFilters = ref<any>({});
  const nameSpaceCostFilters = ref<any>({});

  const dailyloading = ref(false);
  const workloading = ref(false);
  const spaceloading = ref(false);
  const clusterloading = ref(false);
  const overviewloading = ref(false);
  const loading = ref(false);
  const timeMode = ref('utc');

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

  const overData = ref({});
  const pageId = computed(() => {
    return query.id || props.viewId;
  });
  const summaryData = computed(() => {
    const list = map(clusterCostOverview, (item) => {
      item.value = get(overData.value, item.key) || 0;
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
      clusterloading.value = true;
      const params = {
        ...omit(queryParams, ['connectorID']),
        fieldName: 'connector_id',
        fieldType: 'filter'
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveFieldValues(params);
      clusterList.value = data?.items || [];
      queryParams.connectorID = get(clusterList.value, '0.value') || '';
      clusterName.value = get(clusterList.value, '0.label') || 'Cluster';

      dailyCostFilters.value.connectorID = queryParams.connectorID;
      workloadCostFilters.value.connectorID = queryParams.connectorID;
      nameSpaceCostFilters.value.connectorID = queryParams.connectorID;
      console.log('dailyCostFilters====', dailyCostFilters.value);
      each(get(dailyCostFilters.value, 'filters') || [], (fItem) => {
        each(fItem, (sItem) => {
          sItem.values = [queryParams.connectorID];
          sItem.fieldName = 'connector_id';
        });
      });
      clusterloading.value = false;
    } catch (error) {
      clusterloading.value = false;
      console.log(error);
    }
  };
  const getSummaryData = async () => {
    try {
      overviewloading.value = true;
      const params = {
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryClusterPerspectiveSummary(params);
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
        ...omit(queryParams, 'endTime'),
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z'),
        source: 'daily chart'
      };
      const { data } = await queryPerspectiveData(params);
      let list = data?.items || [];
      list = sortBy(list, (s) => s.itemName);
      // const list = testData;
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
      console.log(error);
    }
  };

  const getNamespaceCostChart = async () => {
    try {
      spaceloading.value = true;
      const params = {
        ...omit(nameSpaceCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime')
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      const list = data?.items || [];
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
      spaceloading.value = false;
    } catch (error) {
      spaceloading.value = false;
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
      workloading.value = true;
      const params = {
        ...omit(workloadCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime')
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      let list = data?.items || [];
      list = sortBy(list, (s) => s.itemName);
      console.log('workload==1=2', list);
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
                obj[item.itemName][k] = concat(
                  get(obj, `${item.itemName}.${k}`),
                  item[k]
                );
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
      workloading.value = false;
      console.log('workloadCostChart======', workloadCostChart.value);
    } catch (error) {
      workloading.value = false;
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

      const workloadFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'workload'
      );
      const namespaceFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'namespace'
      );
      dailyCostFilters.value = {
        ...cloneDeep({ ...dailyFilter, step: '' }),
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };

      workloadCostFilters.value = {
        ...workloadFilter,
        ...queryParams,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      nameSpaceCostFilters.value = {
        ...namespaceFilter,
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
    queryParams,
    dailyloading,
    workloading,
    spaceloading,
    clusterloading,
    id: pageId,
    loading,
    overviewloading,
    timeMode
  };
}
