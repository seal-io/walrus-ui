<template>
  <div class="wrapper">
    <LineBarChart
      class="chart-wrapper"
      height="260px"
      show-type="line"
      :line-list="data.list"
      :data-config="dataConfig"
      :x-axis="data.xAxis"
      :config-options="{
        title: {
          ...title
        },
        legend: {
          show: false,
          right: 'center',
          top: 0
        },
        grid: {
          ...grid,
          top: 40
        }
      }"
    ></LineBarChart>
  </div>
</template>

<script lang="ts" setup>
  import useCallCommon from '@/hooks/use-call-common';
  import { ref, computed } from 'vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';

  defineProps({
    data: {
      type: Object,
      default() {
        return {
          xAxis: [],
          list: []
        };
      }
    }
  });
  const { t } = useCallCommon();
  const grid = {
    left: 0,
    right: 5,
    top: 0,
    bottom: 0,
    containLabel: true
  };
  const dataConfig = ref([
    {
      name: 'totalCost',
      label: 'Daily Cost Trend',
      value: [1, 3, 7, 8, 9],
      color: 'rgba(128, 212, 197, 1)'
    }
  ]);
  const title = computed(() => {
    return {
      text: t('dashboard.cost.daily'),
      left: 'auto',
      top: 0,
      textStyle: {
        color: 'rgb(78,89,105)',
        fontSize: 12
      }
    };
  });
</script>

<style lang="less" scoped>
  .wrapper {
    padding: 10px;
    text-align: right;
    background-color: rgba(230, 244, 254, 0.5);
    border-radius: var(--border-radius-small);

    .content {
      display: inline-block;
      flex-direction: column;
      margin-bottom: 6px;
      padding: 5px 10px;
      color: var(--color-text-2);
      text-align: center;
      background-color: rgba(159, 232, 219, 0.3);
      border-radius: 4px;

      .title {
        margin-right: 10px;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 14px;
      }

      .value {
        margin-right: 10px;
        margin-bottom: 6px;
        font-weight: 500;
        font-size: 14px;
      }

      .icon-fall {
        font-size: 14px;
      }

      .rate {
        color: var(--seal-color-warning);
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
</style>
