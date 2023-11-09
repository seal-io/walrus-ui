<template>
  <SpinCard :title="$t('dashboard.deployment.title')" borderless>
    <template #title>
      <div style="display: flex; justify-content: space-between">
        <span>{{ $t('dashboard.deployment.title') }}</span>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeUnit="queryParams.step"
          step="month"
          :show-extra="false"
          :short-cuts="DateShortCuts"
          today-in
          @change="handleDateChange"
        ></DateRange>
      </div>
    </template>
    <div class="data-wrapper">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ lg: 16, md: 12, sm: 24, xs: 24 }">
          <StackLineChart
            class="bar-item"
            :height="height"
            :data-config="dataConfig"
            :data="dataList"
            :x-axis="xAxis"
            :title="$t('dashboard.deployment.history')"
          ></StackLineChart>
        </a-grid-item>
        <a-grid-item :span="{ lg: 8, md: 12, sm: 24, xs: 24 }">
          <pieChart
            class="bar-item"
            style="flex: 1"
            :data-list="pieDataList"
            :height="height"
            :config-options="pieOptions"
            :center="pieCenter"
            :radius="pieRadius"
          ></pieChart>
        </a-grid-item>
      </a-grid>
    </div>
    <div class="m-b-20">
      <div class="app-list-title">{{
        $t('dashboard.deployment.lastest', {
          name: $t('applications.applications.table.service')
        })
      }}</div>
      <lastDeployApp
        :title="$t('applications.applications.table.service')"
        :list="serviceList"
        :type="ServiceDataType.service"
      ></lastDeployApp>
    </div>
    <div>
      <div class="app-list-title">{{
        $t('dashboard.deployment.lastest', {
          name: $t('applications.applications.table.resource')
        })
      }}</div>
      <lastDeployApp
        :title="$t('applications.applications.table.resource')"
        :list="resourceList"
        :type="ServiceDataType.resource"
      ></lastDeployApp>
    </div>
  </SpinCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { map, get, ceil, sortBy } from 'lodash';
  import StackLineChart from '@/components/stack-line-chart/index.vue';
  import { ServiceDataType } from '@/views/application-management/services/config';
  import pieChart from '@/components/pie-chart/index.vue';
  import DateRange from '@/components/date-range/index.vue';
  import { setEndTimeAddDay } from '@/views/config';
  import { getStackLineDataList } from '@/views/config/utils';
  import lastDeployApp from './last-deploy-app.vue';
  import {
    deployDataConfig,
    statusColorMap,
    DateShortCuts,
    chartStatusColorMap
  } from '../config';
  import {
    queryApplicationRevisionsChart,
    queryLatestDeployments
  } from '../api/dashboard';

  const pieStyleConfig = {
    label: {
      show: true,
      fontWeight: '500',
      formatter: ['{a|{b}}', '{a|{c}({d}%)}'].join('\n'),
      rich: {
        a: {
          lineHeight: 16,
          fontSize: 11
        }
      }
    }
  };
  const grid = {
    left: 0,
    right: 0,
    top: 40,
    bottom: 0,
    containLabel: true
  };
  const title = {
    text: '',
    left: 'auto',
    top: 8,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12
    }
  };
  const height = '300px';
  const pieCenter = ['50%', '50%'];
  const pieRadius = ['0%', '80%'];
  const { t } = useI18n();
  const queryParams = {
    step: 'day' as any, // day month year
    startTime: dayjs().subtract(29, 'd').format('YYYY-MM-DDT00:00:00Z'),
    endTime: dayjs().format('YYYY-MM-DDTHH:mm:ssZ')
  };

  const xAxis = ref<string[]>([]);
  const serviceList = ref([]);
  const resourceList = ref([]);
  const summaryData = ref({});
  const dataList = ref<{ name: string; value: number[] }[]>([]);
  const dataConfig = computed(() => {
    return [
      {
        name: 'running',
        label: t('dashboard.deployment.running'),
        color: statusColorMap.running
      },
      {
        name: 'failed',
        label: t('dashboard.deployment.failed'),
        color: statusColorMap.failed
      },
      {
        name: 'succeed',
        label: t('dashboard.deployment.succeed'),
        color: statusColorMap.succeed
      }
    ];
  });
  const pieOptions = computed(() => {
    return {
      title: {
        ...title,
        text: t('dashboard.deployment.summary')
      },
      grid: {
        ...grid
      },
      legend: {
        show: false,
        orient: 'vertical',
        top: 'middle',
        left: '60%',
        itemWidth: 20,
        itemHeight: 8
      }
    };
  });
  const pieDataList = computed(() => {
    const list = map(deployDataConfig, (item) => {
      return {
        ...item,
        ...pieStyleConfig,
        value: summaryData.value[item.key],
        name: t(item.name)
      };
    }).filter((sItem) => sItem.value);
    return list;
  });
  const getApplicationRevisionsChart = async () => {
    try {
      const params = {
        ...queryParams,
        startTime: dayjs(queryParams.startTime).format('YYYY-MM-DDT00:00:00Z'),
        endTime: setEndTimeAddDay(queryParams.endTime, 'local')
      };
      const { data } = await queryApplicationRevisionsChart(params);
      summaryData.value = get(data, 'statusCount') || {};
      const revisions = get(data, 'statusStats');
      // revisions = sortBy(revisions, (s) => s.startTime);
      const result = getStackLineDataList(revisions, {
        fields: ['running', 'succeed', 'failed'],
        xAxis: 'startTime'
      });
      dataList.value = result.data;
      xAxis.value = result.xAxis;
    } catch (error) {
      dataList.value = [];
      xAxis.value = [];
    }
  };
  const getApplicationRevisionsList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 10,
        sort: ['-createTime'],
        isService: true
      };
      const { data } = await queryLatestDeployments();

      serviceList.value = data.items || [];
    } catch (error) {
      serviceList.value = [];
    }
  };
  const getResourceRevisionsList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 10,
        sort: ['-createTime'],
        isService: false
      };
      const { data } = await queryLatestDeployments();

      resourceList.value = data.items || [];
    } catch (error) {
      resourceList.value = [];
    }
  };
  const init = () => {
    getApplicationRevisionsChart();
    getApplicationRevisionsList();
    getResourceRevisionsList();
  };
  const handleDateChange = (val) => {
    init();
  };
  init();
</script>

<style lang="less" scoped>
  .data-wrapper {
    margin-bottom: 20px;

    .bar-item {
      padding: 10px;
      background-color: rgba(230, 244, 254, 0.5);
      border-radius: 4px;
    }
  }

  .app-list-title {
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 12px;
  }
</style>
