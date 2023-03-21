<template>
  <div class="line-bar-box">
    <a-spin style="width: 100%" :loading="loading">
      <BarChart
        v-if="showType === 'bar'"
        :key="barList.length"
        style="flex: 1"
        :data-list="barList"
        v-bind="$attrs"
        :show-y-label="true"
      ></BarChart>
      <stackLineChart
        v-if="showType === 'line'"
        :key="lineList.length"
        style="flex: 1"
        :data="lineList"
        v-bind="$attrs"
        class="chart-item"
      ></stackLineChart>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, useAttrs } from 'vue';
  import BarChart from '@/components/bar-chart/index.vue';
  import stackLineChart from '@/components/stack-line-chart/index.vue';

  interface DataItem {
    name: string;
    value: number[];
  }
  const props = defineProps({
    barList: {
      type: Array as PropType<DataItem[]>,
      default() {
        return [];
      }
    },
    lineList: {
      type: Array as PropType<DataItem[]>,
      default() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showType: {
      type: String as PropType<'bar' | 'line'>,
      default() {
        return 'bar';
      }
    }
  });
  const $attrs = useAttrs();
</script>

<script lang="ts">
  export default {
    name: 'LineBarChart',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  .line-bar-box {
    display: flex;
    justify-content: flex-start;
  }
</style>
