<template>
  <div class="pie-box">
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
  const { chartOption } = useChartOption(() => {
    return {
      tooltip: {
        show: false,
        trigger: 'item'
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
