<template>
  <div class="bar-box">
    <Chart
      v-if="dataList.length"
      :option="chartOption"
      :style="{ width: '100%', height }"
    />
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
  import { map, maxBy, ceil, get, round } from 'lodash';
  import { PropType, ref } from 'vue';
  import { BarSeriesOption } from 'echarts';

  import useChartOption from '@/hooks/chart-option';

  type CustomValue = {
    max: number;
    minInterval: number;
  };
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
    showYLabel: {
      type: Boolean,
      default() {
        return false;
      }
    },
    configOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const calcMaxValue = (): CustomValue => {
    const maxData = maxBy(
      props.dataList,
      (o) => get(o, 'value.0') || o.value
    ) as {
      value: number;
      name: string;
    };
    const minInterval = ceil(maxData?.value / 4);
    const max = minInterval * 4;
    return { max, minInterval };
  };
  const { chartOption } = useChartOption(() => {
    const maxValue = calcMaxValue();
    const data = map(props.dataList, (item) => {
      return {
        value: item.name,
        textStyle: {
          color: '#1d2129',
          lineHeight: 5
        }
      };
    });
    return {
      grid: {
        left: 0,
        right: 0,
        top: 16,
        bottom: 0,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        show: true,
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: 11
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(29,33,41,0.8)'
          }
        },
        data
      },
      yAxis: {
        type: 'value',
        show: true,
        // max: maxValue.max,
        // minInterval: maxValue.minInterval,
        // min: 0,
        axisLabel: {
          show: props.showYLabel
        },
        splitLine: {
          lineStyle: {
            color: '#eaecee'
          }
        }
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      series: {
        data: props.dataList.map((o) => {
          return {
            name: o.name,
            value: round(get(o, 'value.0') || o.value, 3)
          };
        }),
        type: 'bar',
        barWidth: 16,
        label: {
          show: true,
          position: 'top',
          fontWeight: 500,
          fontSize: 12
        },
        itemStyle: {
          borderColor: 'transparent',
          borderRadius: 0
        }
      },
      ...props.configOptions
    };
  });
</script>

<style lang="less" scoped>
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
