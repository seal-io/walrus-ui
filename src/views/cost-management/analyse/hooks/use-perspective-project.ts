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
  assignIn
} from 'lodash';
import { getStackLineData } from '@/views/config';
import { getTimeRange, projectCostOverview, setEndTimeAddDay } from '../config';
import { CostAnalyRow, ChartData } from '../config/interface';
import {
  queryItemPerspective,
  queryPerspectiveData,
  queryProjectPerspectiveSummary,
  queryPerspectiveFieldValues
} from '../api';
import testData, { statckLineData } from '../config/testData';

export default function usePerspectiveCost(props) {
  const { route, t } = useCallCommon();
  const { query } = route;
  const projectCostFilters = ref<any>({});
  const projectList = ref<{ label: string; value: string }[]>([]);
  const projectCostChart = ref<ChartData>({
    xAxis: [],
    line: [],
    bar: [],
    dataConfig: []
  });

  const projectloading = ref(false);
  const loading = ref(false);
  const apploading = ref(false);
  const overviewloading = ref(false);
  const collectedTimeRange = ref<string[]>([]);

  const timeMode = ref('utc');

  const projectName = ref('');
  const queryParams = reactive({
    startTime: '',
    endTime: '',
    project: ''
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
  const getProjectList = async (flag?) => {
    try {
      projectloading.value = true;
      const params = {
        ...omit(queryParams, ['project']),
        fieldName: 'label:seal.io/project-name',
        fieldType: 'filter',
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
      };
      const { data } = await queryPerspectiveFieldValues(params);
      projectList.value = data?.items || [];
      if (!flag) {
        queryParams.project = get(data, 'items.0.value') || '';
        projectName.value = get(data, 'items.0.label') || 'Project';
        // set filter value
        const projectData = get(data, 'items.0') || {};
        projectName.value = projectData?.label || 'Project';
        each(get(projectCostFilters.value, 'filters') || [], (fItem) => {
          each(fItem, (sItem) => {
            sItem.values = [queryParams.project];
          });
        });
      }
      projectloading.value = false;
    } catch (error) {
      projectloading.value = false;
      projectList.value = [];
      console.log(error);
    }
  };
  const getSummaryData = async () => {
    if (!queryParams.project) {
      overData.value = {};
      return;
    }
    try {
      overviewloading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        project: queryParams.project,
        endTime: setEndTimeAddDay(queryParams.endTime, timeMode.value)
        // startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        // endTime: dayjs(queryParams.endTime).format('YYYY-MM-DDT23:59:59Z')
      };
      const { data } = await queryProjectPerspectiveSummary(params);
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
      console.log(error);
    }
  };
  const getProjectCostChart = async () => {
    if (!queryParams.project) {
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      return;
    }
    try {
      apploading.value = true;
      const params = {
        ...omit(projectCostFilters.value, 'paging'),
        ...omit(queryParams, 'endTime')
      };
      const { data } = await queryPerspectiveData(params);
      // const data = workloadData;
      let list = data?.items || [];
      list = sortBy(list, (s) => s.itemName);
      // let list = statckLineData;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      const result = getStackLineData({
        list,
        step: projectCostFilters.value.step
      });
      projectCostChart.value = result;
      apploading.value = false;
    } catch (error) {
      apploading.value = false;
      projectCostChart.value = { xAxis: [], line: [], bar: [], dataConfig: [] };
      console.log(error);
    }
  };

  const getPerspectiveItemInfo = async () => {
    if (!pageId.value) return;
    try {
      loading.value = true;
      const id = pageId.value as string;
      const { data } = await queryItemPerspective({ id });
      const allocationQueries = get(data, 'allocationQueries') || [];
      const startTime = get(data, 'startTime');
      const timeRange = getTimeRange(startTime) || [];
      queryParams.startTime = get(timeRange, '0');
      queryParams.endTime = get(timeRange, '1');
      const projectFilter = find(
        allocationQueries,
        (item) => item.groupBy === 'label:seal.io/service-path'
      );

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
    getProjectList,
    projectList,
    projectCostFilters,
    projectCostChart,
    summaryData,
    projectName,
    queryParams,
    projectloading,
    apploading,
    id: pageId,
    loading,
    overviewloading,
    timeMode,
    collectedTimeRange
  };
}
