<template>
  <div class="issue-stack-trend">
    <Chart
      v-if="data.length"
      :style="{ height: height }"
      :options="chartOption"
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
    <a-space class="options-list" :style="{ [filterPosition]: '10px' }">
      <slot name="filter"></slot>
      <a-select
        v-if="showFilter"
        v-model="selectedList"
        style="min-width: 300px; text-align: left"
        :placeholder="$t('common.chart.filter.holder')"
        multiple
        :max-tag-count="1"
        allow-clear
        allow-search
        @change="handleSelectedChange"
      >
        <template #prefix>
          <icon-font type="icon-filter" style="color: var(--color-text-2)" />
        </template>
        <a-option
          v-for="(item, index) in dataConfig"
          :key="index"
          :value="item.name"
          :label="$t(item.label)"
        ></a-option>
      </a-select>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import {
    get,
    map,
    find,
    divide,
    sortBy,
    filter,
    includes,
    cloneDeep
  } from 'lodash';
  import useChartOption from '@/hooks/chart-option';
  import { LineSeriesOption, EChartsOption, graphic } from 'echarts';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { PropType, ref, computed } from 'vue';
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
    },
    maxLegend: {
      type: Number,
      default() {
        return 5;
      }
    },
    filterPosition: {
      type: String,
      default() {
        return 'right';
      }
    }
  });
  const selectedList = ref<string[]>([]);
  const { t } = useI18n();

  const showFilter = computed(() => {
    return props.data?.length >= props.maxLegend;
  });
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
      data: [...data],
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
        color: lineColor,
        opacity: 0.7
      },
      areaStyle
    };
  };
  const handleSelectedChange = () => {
    console.log('selectedList===', selectedList.value);
  };
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <div class='series-name'>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span><span>${el.seriesName}</span>
        </div>
        <span class="tooltip-value">${el.value?.toLocaleString()}</span>
      </div>`
      )
      .reverse()
      .join('');
  };
  const { chartOption } = useChartOption((): any => {
    let configData: DataConfigItem[] = [];
    let listData: ChartData[] = [];
    if (!selectedList.value.length) {
      configData = cloneDeep(props.dataConfig);
      listData = cloneDeep(props.data);
    } else {
      configData = filter(cloneDeep(props.dataConfig), (sItem) => {
        return includes(selectedList.value, sItem.name);
      });
      listData = filter(cloneDeep(props.data), (sItem) => {
        return includes(selectedList.value, sItem.name);
      });
    }
    const seriesDataList = map(configData, (item) => {
      const valueData = find(listData || [], (sItem) => {
        return item.name === sItem.name;
      });
      const value = valueData?.value || [];
      return generateSeries(item.label, value, item.color, item.areaColor);
    });
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
          rotate: 30,
          formatter(value: number, idx: number) {
            if (props.xAxis?.length === 1) {
              return `${value}`;
            }
            if (idx === 0) {
              return '';
            }

            return `${value}`;
          }
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
        // position(point, params, dom, rect, size) {
        //   // 固定在顶部
        //   return [point[1], '10%'];
        // },
        formatter(result) {
          // console.log('params======', result);
          const params = sortBy(result, (item) => item.value);
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div class="chart-tooltip-wrap">
            <div class="tooltip-title">${firstElement.axisValueLabel}</div>
            <div class="content-wrap" style="column-count: ${Math.ceil(
              divide(params.length, 10)
            )}">
              ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
              </div>
          </div>`;
        },
        className: 'echarts-tooltip-diy'
      },
      series: [...seriesDataList]
    };
  });
</script>

<style lang="less" scoped>
  .issue-stack-trend {
    position: relative;

    .options-list {
      position: absolute;
      top: 0;
      display: flex;
      align-items: center;
    }
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
</style>
