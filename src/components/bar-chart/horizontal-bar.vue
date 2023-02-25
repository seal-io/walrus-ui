<template>
  <div class="bar-box">
    <Chart v-if="dataList.length" :height="height" :option="chartOption" />
    <div
      v-if="!dataList.length"
      class="title"
      :style="{ marginTop: `${get(configOptions, 'title.top')}px` }"
      >{{ get(configOptions, 'title.text') }}</div
    >
    <div v-if="!dataList.length" :style="{ height: height }" class="empty-data">
      <a-empty :style="{ marginTop: `${height}px` }"></a-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { get, map, round } from 'lodash';
  import { PropType } from 'vue';
  import useChartOption from '@/hooks/chart-option';

  const props = defineProps({
    dataList: {
      type: Array as PropType<{ value: number | number[]; name: string }[]>,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default() {
        return '120px';
      }
    },
    configOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const { chartOption } = useChartOption(() => {
    const nameList = map(props.dataList, (item) => {
      return item.name;
    });
    return {
      title: {
        ...props.configOptions?.title
      },
      grid: {
        left: 0,
        right: 0,
        top: 16,
        bottom: 0,
        containLabel: true,
        ...props.configOptions?.grid
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true
        },
        splitLine: {
          lineStyle: {
            color: '#eaecee'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: [...nameList],
        axisLabel: {
          show: true,
          color: '#4E5969'
        },
        axisTick: {
          show: false,
          length: 2,
          lineStyle: {
            color: '#A9AEB8'
          },
          alignWithLabel: true
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(29,33,41,0.8)'
          }
        }
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      series: [
        {
          data: props.dataList.map((o) => {
            return {
              name: o.name,
              value: round(get(o, 'value.0') || o.value, 3)
            };
          }),
          type: 'bar',
          barWidth: 14,
          itemStyle: {
            color: '#206ccf',
            borderRadius: [0, 0, 0, 0]
          }
        }
      ]
    };
  });
</script>

<style scoped lang="less">
  .bar-box {
    .empty-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      :deep(.arco-empty-description) {
        font-size: 12px;
      }
    }

    .title {
      color: rgb(78, 89, 105);
      font-weight: 500;
      font-size: 12px;
      text-align: center;
    }
  }
</style>
