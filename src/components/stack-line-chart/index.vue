<template>
  <div class="issue-stack-trend">
    <Chart
      v-if="data.length"
      :style="{ height: height }"
      :option="chartOption"
    />
    <div
      v-if="!data.length"
      class="title"
      :style="{ marginTop: `${get(configOptions, 'title.top')}px` }"
      >{{ get(configOptions, 'title.text') }}</div
    >
    <div v-if="!data.length" :style="{ height: height }" class="empty-data">
      <a-empty :style="{ marginTop: `${height}px` }"></a-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { get, map, find } from 'lodash';
  import useChartOption from '@/hooks/chart-option';
  import { LineSeriesOption, EChartsOption, graphic } from 'echarts';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { PropType, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  interface ChartData {
    name: string;
    value: number[];
  }
  interface DataConfigItem {
    label: string;
    name: string;
    color?: string;
    areaColor?: string[];
  }
  const props = defineProps({
    data: {
      type: Object as PropType<ChartData[]>,
      default() {
        return [];
      }
    },
    xAxis: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    dataConfig: {
      type: Array as PropType<DataConfigItem[]>,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default() {
        return '260px';
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    configOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const { t } = useI18n();
  const generateSeries = (
    name: string,
    data: number[],
    lineColor?: string,
    areaColor?: string[]
  ): LineSeriesOption => {
    const areaStyle: any = areaColor?.length
      ? {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: areaColor[0]
            },
            {
              offset: 1,
              color: areaColor[1]
            }
          ])
        }
      : undefined;
    return {
      name: t(name),
      data,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      showSymbol: true,
      itemStyle: {
        color: lineColor
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2
        }
      },
      lineStyle: {
        width: 1.5,
        color: lineColor
      },
      areaStyle
    };
  };
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span><span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">${el.value?.toLocaleString()}</span>
      </div>`
      )
      .reverse()
      .join('');
  };
  const { chartOption } = useChartOption((): any => {
    const seriesDataList = map(props.dataConfig, (item) => {
      const valueData = find(props.data || [], (sItem) => {
        return item.name === sItem.name;
      });
      const value = valueData?.value || [];
      return generateSeries(item.label, value, item.color, item.areaColor);
    });
    console.log('seriesDataList===', seriesDataList);
    return {
      title: {
        text: props.title,
        left: '0',
        top: 0,
        textStyle: {
          color: 'rgb(78,89,105)',
          fontSize: 12
        },
        ...get(props.configOptions, 'title')
      },
      grid: {
        left: 10,
        right: 10,
        top: 40,
        bottom: 10,
        containLabel: true,
        ...get(props.configOptions, 'grid')
      },
      legend: {
        right: 0,
        type: 'scroll',
        orient: 'horizontal',
        align: 'auto',
        icon: 'circle',
        textStyle: {
          color: '#4E5969'
        },
        itemHeight: 6,
        itemWidth: 6,
        ...get(props.configOptions, 'legend')
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: props.xAxis || [],
        boundaryGap: false,
        axisLabel: {
          interval: 'auto',
          color: '#4E5969',
          rotate: 30
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return '';
          //   if (
          //     get(props.data, 'xAxis')?.length &&
          //     idx === get(props.data, 'xAxis')?.length - 1
          //   )
          //     return '';
          //   return `${value}`;
          // },
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#eaecee',
            width: 1
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        // axisLabel: {
        //   formatter(value: number, idx: number) {
        //     if (idx === 0) return String(value);
        //     // return `${value / 1000}k`;
        //     return value;
        //   },
        // },
        splitLine: {
          lineStyle: {
            color: '#eaecee'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy'
      },
      series: [...seriesDataList]
    };
  });
</script>

<style lang="less" scoped>
  .empty-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    :deep(.arco-empty-description) {
      font-size: 12px;
    }
  }
</style>
