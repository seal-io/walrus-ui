import { ref, reactive } from 'vue';
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
  cloneDeep
} from 'lodash';
import { CostAnalyRow, ChartData } from '../config/interface';
import { queryItemPerspective, queryPerspectiveData } from '../api';
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

  const queryParams = reactive({
    startTime: '',
    endTime: '',
    query: ''
  });

  const getDailyCostChart = async () => {
    try {
      const params = {
        ...omit(dailyCostFilters.value, 'paging'),
        ...queryParams
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
        ...queryParams
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
        ...queryParams
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
    dailyCostFilters,
    workloadCostFilters,
    nameSpaceCostFilters,
    dailyCostChart,
    workloadCostChart,
    nameSpaceCostChart,
    queryParams
  };
}
