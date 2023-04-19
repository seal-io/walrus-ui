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
    <div class="filter-opts">
      <slot name="filter"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { map, maxBy, ceil, get, round, omit } from 'lodash';
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
        containLabel: true,
        ...get(props.configOptions, 'grid'),
        bottom:
          props.dataList.length > 200
            ? 50
            : get(props.configOptions, 'grid.bottom') || 0
      },
      dataZoom: [
        {
          type: 'slider',
          height: 25,
          show: props.dataList.length > 200,
          startValue: 0,
          endValue: 200
        }
      ],
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
        show: true,
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
        // barWidth: 16,
        barMaxWidth: 16,
        barMinWidth: 4,
        label: {
          show: false, // show label on the bar
          position: 'top',
          fontWeight: 500,
          fontSize: 12
        },
        itemStyle: {
          borderColor: 'transparent',
          borderRadius: 0
        }
      },
      ...omit(props.configOptions, 'grid')
    };
  });
</script>

<style lang="less" scoped>
  .bar-box {
    position: relative;

    .filter-opts {
      position: absolute;
      top: 0;
      right: 10px;
    }

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
