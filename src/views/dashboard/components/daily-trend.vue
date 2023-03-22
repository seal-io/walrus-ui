<template>
  <div class="wrapper">
    <LineBarChart
      class="chart-wrapper"
      height="360px"
      show-type="line"
      :line-list="data.list"
      :data-config="data.dataConfig"
      :x-axis="data.xAxis"
      :config-options="{
        title: {
          ...title
        },
        legend: {
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
  import { ref } from 'vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';

  defineProps({
    data: {
      type: Object,
      default() {
        return {
          xAxis: [],
          list: [],
          dataConfig: []
        };
      }
    }
  });
  const title = {
    text: '项目消费趋势',
    left: 'auto',
    top: 0,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12
    }
  };
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
      label: '',
      value: [1, 3, 7, 8, 9],
      color: 'rgba(102, 201, 255, 0.6)'
      // areaColor: ['rgba(102, 201, 255, 1)', 'rgba(102, 201, 255, 0.2)']
    }
  ]);
</script>

<style lang="less" scoped>
  .wrapper {
    padding: 10px;
    text-align: right;
    background-color: rgba(230, 244, 254, 0.5);
    border-radius: var(--border-radius-small);
  }
</style>
