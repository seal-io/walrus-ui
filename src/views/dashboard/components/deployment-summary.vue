<template>
  <SpinCard
    :title="$t('dashboard.deployment.title')"
    borderless
    :card-style="{
      borderRadius: 'var(--border-radius-small) var(--border-radius-small) 0 0'
    }"
  >
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
    <!-- <div class="m-b-20">
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
    </div> -->
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
  import { useAppStore } from '@/store';
  import { useI18n } from 'vue-i18n';
  import { map, get, ceil, sortBy } from 'lodash';
  import StackLineChart from '@/components/stack-line-chart/index.vue';
  import { ServiceDataType } from '@/views/application-management/services/config';
  import pieChart from '@/components/pie-chart/index.vue';
  import DateRange from '@/components/date-range/index.vue';
  import { setEndTimeAddDay } from '@/views/config';
  import { getStackLineDataList } from '@/views/config/utils';
  import lastDeployApp from './last-deploy-app.vue';
  import { DateShortCuts } from '../config';
  import {
    queryApplicationRevisionsChart,
    queryLatestDeployments
  } from '../api/dashboard';
  import useStatusConfig from '../hooks/use-status-config';

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

  const { deployDataConfig, statusColorMap } = useStatusConfig();
  const appStore = useAppStore();
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
        color: statusColorMap.value.running
      },
      {
        name: 'failed',
        label: t('dashboard.deployment.failed'),
        color: statusColorMap.value.failed
      },
      {
        name: 'succeeded',
        label: t('dashboard.deployment.succeed'),
        color: statusColorMap.value.succeed
      }
    ];
  });
  const pieOptions = computed(() => {
    return {
      title: {
        left: 'auto',
        top: 8,
        textStyle: {
          color: appStore.isDark ? 'rgba(255,255,255,.7)' : 'rgb(78,89,105)',
          fontSize: 12
        },
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
    const list = map(deployDataConfig.value, (item) => {
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
      const result = getStackLineDataList(revisions, {
        fields: ['running', 'succeeded', 'failed'],
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
      const { data } = await queryLatestDeployments(params);

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
        sort: ['-createTime']
      };
      const { data } = await queryLatestDeployments(params);

      resourceList.value = data.items || [];
    } catch (error) {
      resourceList.value = [];
    }
  };
  const init = () => {
    getApplicationRevisionsChart();
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
      background-color: var(--seal-color-bg);
      border-radius: var(--border-radius-small);
    }
  }

  .app-list-title {
    margin-bottom: 10px;
    font-weight: var(--font-weight-medium);
    font-size: 12px;
  }
</style>
