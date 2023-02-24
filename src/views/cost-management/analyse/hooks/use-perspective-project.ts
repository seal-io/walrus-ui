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
  cloneDeep,
  keys
} from 'lodash';
import { CostAnalyRow, ChartData } from '../config/interface';
import { queryItemPerspective, queryPerspectiveData } from '../api';
import testData, { statckLineData } from '../config/testData';

export default function usePerspectiveCost() {
  const { route } = useCallCommon();
  const id = route.query.id as string;

  const projectCostFilters = ref<any>({});

  const projectCostChart = ref<ChartData>({
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

  const getProjectCostChart = async () => {
    try {
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...queryParams
      };
      const { data } = await queryPerspectiveData(params);
      let list = data?.item || [];
      // let list = statckLineData;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
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
        projectCostChart.value.line.push({
          name: pKey,
          value: dataObj[pKey]['totalCost']
        });
        projectCostChart.value.dataConfig.push({
          name: pKey,
          label: pKey
        });
        projectCostChart.value.xAxis = dataObj[pKey]['startTime'];
      });
      projectCostChart.value.xAxis = map(
        projectCostChart.value.xAxis,
        (kItem) => {
          return dayjs(kItem).format('YYYY.MM.DD');
        }
      );
    } catch (error) {
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      console.log(error);
    }
  };

  const getPerspectiveItemInfo = async () => {
    try {
      const { data } = await queryItemPerspective({ id });
      const allocationQueries = get(data, 'allocationQueries') || [];

      const projectFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'label:project'
      );

      projectCostFilters.value = {
        ...projectFilter,
        ...queryParams
      };
    } catch (error) {
      console.log(error);
    }
  };
  return {
    getPerspectiveItemInfo,
    getProjectCostChart,
    projectCostFilters,
    projectCostChart,
    queryParams
  };
}
