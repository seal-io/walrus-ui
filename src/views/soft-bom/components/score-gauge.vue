<template>
  <div class="score-gauge-wrap">
    <Chart style="width: 100%; height: 260px" :option="chartOptions" />
    <div class="s-box"
      ><div v-show="showLabel">
        <slot>
          <span class="severity" :class="[severity]">{{
            capitalize(severity)
          }}</span>
        </slot>
      </div></div
    >
  </div>
</template>

<script lang="ts" setup>
  import { get, capitalize } from 'lodash';
  import { computed } from 'vue';
  import useChartOption from '@/hooks/chart-option';
  import { severityColor } from '@/config/global';

  const props = defineProps({
    showLabel: {
      type: Boolean,
      default() {
        return true;
      },
    },
    severity: {
      type: String,
      default() {
        return 'none';
      },
    },
    color: {
      type: String,
      default() {
        return '';
      },
    },
    score: {
      type: Number,
      default() {
        return 0;
      },
    },
  });
  const chartOptions = computed(() => {
    const { chartOption } = useChartOption(() => {
      return {
        series: [
          {
            center: ['50%', '50%'],
            radius: '100%',
            max: 10,
            type: 'gauge',
            progress: {
              show: true,
              width: 8,
            },
            axisLine: {
              lineStyle: {
                width: 8,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 10,
              distance: 2,
              lineStyle: {
                width: 1,
                color: '#999',
              },
            },
            itemStyle: {
              color: props.color || get(severityColor, props.severity),
            },
            axisLabel: {
              distance: 12,
              color: '#999',
              fontSize: 18,
            },
            // pointer: {
            //   width: 3,
            //   length: '70%'
            // },
            anchor: {
              show: false,
              showAbove: true,
              size: 5,
              itemStyle: {
                borderWidth: 5,
                color: props.color || get(severityColor, props.severity),
              },
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: false,
              fontSize: 28,
              offsetCenter: [0, '70%'],
            },
            data: [
              {
                value: props.score,
              },
            ],
          },
        ],
      };
    });
    return chartOption.value;
  });
</script>

<style lang="less" scoped>
  .score-gauge-wrap {
    .s-box {
      margin-bottom: 20px;
      line-height: 2;
      text-align: center;

      .severity {
        padding: 3px 6px;
        font-size: 14px;
        border: 1px solid #e5e6eb;
        border-radius: 4px;

        &.critical {
          color: #f53f3f;
          border: 1px solid #f53f3f;
        }

        &.high {
          color: #f77234;
          border: 1px solid #f77234;
        }

        &.medium {
          color: #f7ba1e;
          border: 1px solid #f7ba1e;
        }

        &.low {
          color: #9fdb1d;
          border: 1px solid #9fdb1d;
        }

        &.none {
          color: #e5e6eb;
          border: 1px solid #e5e6eb;
        }
      }
    }
  }
</style>
