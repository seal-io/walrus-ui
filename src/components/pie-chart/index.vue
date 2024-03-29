<template>
  <div class="pie-box">
    <Chart
      v-if="dataList.length"
      :option="chartOption"
      :style="{ width: '100%', height }"
    />

    <div v-if="!dataList.length" :style="{ height: height }" class="empty-data">
      <div
        class="title"
        :style="{ marginTop: `${get(configOptions, 'title.top')}px` }"
        >{{ get(configOptions, 'title.text') }}</div
      >
      <a-empty :style="{ marginTop: `${height}px` }"></a-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { PieSeriesOption } from 'echarts';

  import useChartOption from '@/hooks/chart-option';

  const props = defineProps({
    dataList: {
      type: Array as PropType<{ value: number; name: string }[]>,
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
    radius: {
      type: [String, Array] as PropType<string | string[]>,
      default() {
        return '90%';
      }
    },
    center: {
      type: Array as PropType<string[]>,
      default() {
        return ['50%', '50%'];
      }
    },
    configOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    emphasisDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const textColor = 'rgba(78,89,105,1)';
  const textLightColor = 'rgba(29,33,41,.7)';
  const splitLineColor = '#eaecee';
  const titleColor = '#1d2129';

  const { chartOption, isDark } = useChartOption((dark) => {
    return {
      tooltip: {
        show: true,
        borderWidth: 0,
        trigger: 'item',
        alwaysShowContent: false,
        // formatter: '{a}\n{b} : {c} ({d}%)',
        formatter(params) {
          return `<div class="content">${params.marker}${params.name} : ${params.value} (${params.percent}%)</div`;
        },
        className: 'pie-tooltip'
      },
      grid: {
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
        containLabel: true
      },
      legend: {
        show: true,
        left: 0,
        orient: 'vertical',
        align: 'left',
        itemWidth: 20,
        itemHeight: 8
        // formatter(name) {
        //   return `${name}`;
        // },
      },
      label: {
        color: dark ? 'rgba(255,255,255,.5)' : textLightColor,
        fontWeight: '500',
        fontSize: 12
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: props.radius,
          center: props.center,
          data: props.dataList,
          emphasis: {
            disabled: props.emphasisDisabled,
            itemStyle: {
              borderWidth: 0,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(243, 246, 250, 0.5)'
            }
          }
        }
      ],
      ...props.configOptions
    };
  });
</script>

<style lang="less" scoped>
  .pie-box {
    .empty-data {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      :deep(.arco-empty-description) {
        font-size: 12px;
      }

      .title {
        position: absolute;
        top: 0;
        left: 10px;
        color: rgb(78, 89, 105);
        font-weight: var(--font-weight-medium);
        font-size: 12px;
        text-align: center;
      }
    }
  }
</style>
