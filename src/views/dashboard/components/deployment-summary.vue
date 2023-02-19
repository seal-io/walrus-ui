<template>
  <SpinCard title="应用部署" borderless>
    <div class="data-wrapper">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ lg: 16, md: 12, sm: 24, xs: 24 }">
          <StackLineChart
            class="bar-item"
            :height="height"
            :data-config="dataConfig"
            :data="dataList"
            :x-axis="xAxis"
            title="历史记录"
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
    <div>
      <div class="app-list-title">最新10条部署</div>
      <lastDeployApp :list="appList"></lastDeployApp>
    </div>
  </SpinCard>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { map, get, ceil } from 'lodash';
  import StackLineChart from '@/components/stack-line-chart/index.vue';
  import pieChart from '@/components/pie-chart/index.vue';
  import lastDeployApp from './last-deploy-app.vue';

  import { deployDataConfig, statusColorMap } from '../config';

  const props = defineProps({
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  });
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
    top: 60,
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
  const height = '280px';
  const pieCenter = ['50%', '50%'];
  const pieRadius = ['0%', '90%'];
  const { t } = useI18n();

  const dataConfig = ref([
    {
      name: '一',
      label: 'Running',
      color: statusColorMap.running
    },
    {
      name: '二',
      label: 'Auditing',
      color: statusColorMap.auditing
    },
    {
      name: '三',
      label: 'Failed',
      color: statusColorMap.failed
    },
    {
      name: '四',
      label: 'Successful',
      color: statusColorMap.done
    }
  ]);
  const xAxis = ref(['一月', '二月', '三月', '四月', '五月']);
  const appList = ref([
    {
      name: 'app-1',
      time: '2022-10-01',
      duration: '3min',
      status: 'done',
      env: 'dev',
      assignee: '张'
    },
    {
      name: 'app-2',
      time: '2022-10-02',
      duration: '4min',
      status: 'auditing',
      env: 'prod',
      assignee: '王'
    },
    {
      name: 'app-3',
      time: '2022-10-03',
      duration: '5min',
      status: 'running',
      env: 'pre',
      assignee: '钱'
    },
    {
      name: 'app-4',
      time: '2022-10-04',
      duration: '6min',
      status: 'failed',
      env: 'uat',
      assignee: '李'
    }
  ]);
  const dataList = ref([
    { name: '一', value: [5, 3, 7, 8, 9] },
    { name: '二', value: [1, 6, 10, 12, 21] },
    { name: '三', value: [9, 10, 15, 6, 15] },
    { name: '四', value: [4, 21, 8, 16, 18] }
  ]);
  const pieOptions = computed(() => {
    return {
      title: {
        ...title,
        text: '统计'
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
        value: item.value,
        name: t(item.name)
      };
    }).filter((sItem) => sItem.value);
    return list;
  });
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
