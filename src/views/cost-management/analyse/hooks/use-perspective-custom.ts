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
import testData, { dailyCostData } from '../config/testData';

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

  /**
   *
   * @date 2023-03-22
   * @param {any} {list: source list
   * @param {any} key: data key
   * @param {any} xAxis}:
   */
  const getStackLineData = ({
    list,
    key = 'totalCost',
    fieldName = 'itemName',
    xAxis = 'startTime',
    step = 'day'
  }: {
    list: object[];
    key?: string;
    fieldName?: string;
    xAxis?: string;
    step?: string;
  }) => {
    const result = {
      bar: [],
      line: [] as any[],
      xAxis: [] as string[],
      dataConfig: [] as any[]
    };
    list = sortBy(list, (s) => s[xAxis]);
    const diffFieldName = uniqBy(list, (s) => s[fieldName]);
    // {[key]: {name: key, value: []}}
    const dataObj = reduce(
      diffFieldName,
      (obj, item) => {
        obj[get(item, fieldName)] = {
          name: get(item, fieldName),
          value: []
        };
        result.dataConfig.push({
          name: get(item, fieldName),
          label: get(item, fieldName)
        });
        return obj;
      },
      {}
    );
    // {'2023-03-22': {fieldName: ''}}
    const fielNameValueInxAixs = reduce(
      list,
      (obj, item) => {
        const xAxisVal = dayjs(item[xAxis]).format(get(dateFormatMap, step));
        result.xAxis.push(xAxisVal);
        const fieldNameVal = item[fieldName];
        if (obj[xAxisVal]) {
          if (!get(obj, `${xAxisVal}.${fieldNameVal}`)) {
            obj[xAxisVal][fieldNameVal] = item[key];
          }
        } else {
          obj[xAxisVal] = {};
          obj[xAxisVal][fieldNameVal] = item[key];
        }
        return obj;
      },
      {}
    );
    // ['2023-1','2023-1',...]
    const xAxisList = keys(fielNameValueInxAixs);
    each(diffFieldName, (p) => {
      const k = get(p, fieldName);
      each(xAxisList, (x) => {
        dataObj[k].value.push(get(fielNameValueInxAixs[x], `${k}`) || 0);
      });
    });

    each(diffFieldName, (sItem) => {
      result.line.push(get(dataObj, sItem[fieldName]));
    });
    console.log('result=====', result, xAxisList);
    result.xAxis = uniq(result.xAxis);
    return result;
  };

  const getProjectCostChart = async () => {
    try {
      apploading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime')
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryPerspectiveData(params);
      // const data = dailyCostData;
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
    try {
      loading.value = true;
      const id = route.query.id || props.viewId;
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
