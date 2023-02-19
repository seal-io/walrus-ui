<template>
  <div class="wrapper">
    <LineBarChart
      class="chart-wrapper"
      height="360px"
      show-type="line"
      :data-list="dataList"
      :data-config="dataConfig"
      :x-axis="xAxis"
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

  const title = {
    text: '',
    left: 'center',
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
      name: 'key',
      label: 'Last 60 Days',
      value: [1, 3, 7, 8, 9],
      color: 'rgb(33 74 196 / 50%)'
    }
  ]);
  const xAxis = ref(
    Array(30)
      .fill(1)
      .map((val, i) => {
        return `2023-01-${i + 1}`;
      })
  );

  const dataList = ref([
    {
      name: 'key',
      value: Array(30)
        .fill(1)
        .map((val, i) => {
          return i + 2;
        })
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
