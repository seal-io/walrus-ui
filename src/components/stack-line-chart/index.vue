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
        v-model:input-value="inputValue"
        style="min-width: 200px; text-align: left"
        :placeholder="$t('common.chart.filter.holder')"
        multiple
        :max-tag-count="1"
        allow-clear
        :allow-search="{ retainInputValue: true }"
        @popup-visible-change="handlePopVisibleChange"
        @change="handleSelectedChange"
      >
        <template #prefix>
          <i
            class="iconfont icon-filter"
            style="color: var(--color-text-2)"
          ></i>
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
    cloneDeep,
    slice
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
  const inputValue = ref('');
  const { t } = useI18n();
  const splitLineDarkColor = 'rgba(234, 236, 238,.1)';
  const textColor = 'rgba(78,89,105,1)';
  const textLightColor = 'rgba(29,33,41,.7)';
  const splitLineColor = '#eaecee';
  const titleColor = '#1d2129';
  const legendDarkColor = 'rgba(255,255,255,.7)';

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
  const handleSelectedChange = () => {};
  const handlePopVisibleChange = (visible) => {
    if (!visible) {
      inputValue.value = '';
    }
  };
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    const maxCount = 29;
    const list = items.length > maxCount ? slice(items, 0, maxCount) : items;
    const result = list.map(
      (el) => `<div class="content-panel">
        <div class='series-name'>
          <span style="background-color: ${
            el.color
          };" class="tooltip-item-icon" ></span><span class="tooltip-item-name">${
        el.seriesName
      }</span>
        </div>
        <span class="tooltip-value" >${el.value?.toLocaleString()}</span>
      </div>`
    );
    if (items.length > maxCount) {
      result.push(
        `<div class="content-panel notes-text"><div class="series-name">${t(
          'common.chart.filter.tips'
        )}</div></div>`
      );
    }
    return result.join('');
  };
  const { chartOption } = useChartOption((isDark): any => {
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
          color: isDark ? 'rgba(255,255,255,.7)' : titleColor,
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
      dataZoom: [
        {
          type: 'slider',
          height: 25,
          show: props.xAxis.length > 200,
          startValue: 0,
          endValue: 200
        }
      ],
      legend: {
        right: 0,
        type: 'scroll',
        orient: 'horizontal',
        align: 'auto',
        icon: 'circle',
        textStyle: {
          color: isDark ? legendDarkColor : textLightColor
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
          color: isDark ? textColor : textLightColor,
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
            color: isDark ? splitLineDarkColor : splitLineColor,
            width: 1
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: isDark ? textColor : textLightColor
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
            color: isDark ? splitLineDarkColor : splitLineColor
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        alwaysShowContent: false,
        // position(point, params, dom, rect, size) {
        //   // 固定在顶部
        //   return [point[1], '10%'];
        // },
        formatter(result) {
          const params = sortBy(result, (item) => item.value);
          params.reverse();
          const [firstElement] = params as ToolTipFormatterParams[];
          const colCount = Math.ceil(divide(params.length, 10));
          return `<div class="chart-tooltip-wrap">
            <div class="tooltip-title">${firstElement.axisValueLabel}</div>
            <div class="content-wrap" style="column-count: ${
              colCount > 3 ? 3 : colCount
            }">
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

    .title {
      font-weight: var(--font-weight-medium);
      font-size: 12px;
      text-align: left;
    }

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
