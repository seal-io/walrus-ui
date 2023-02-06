<template>
  <div
    class="bar-wrap"
    :style="{ 'background-image': isPass ? '' : `url(${typeImage[type]})` }"
  >
    <div class="title">
      <span class="text">
        {{ title }}
      </span>
      <a-tooltip v-if="tips" :content="tips">
        <icon-question-circle />
      </a-tooltip>
    </div>
    <div :style="{ height: height }">
      <barChart
        v-if="!isPass && loadend"
        :data-list="dataList"
        :height="height"
      ></barChart>
      <div v-if="isPass && loadend" class="pass">
        <!-- <icon-check-circle/> -->
        <IconFont type="icon-pass"></IconFont>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { every, map } from 'lodash';
  import { computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import barChart from '@/components/bar-chart/index.vue';
  import { ViolationSummary } from '../configs/interface';
  import vuln from '../images/vuln.png';
  import license from '../images/license.png';
  import configure from '../images/configure.png';
  import other from '../images/other.png';

  const props = defineProps({
    data: {
      type: Object as PropType<ViolationSummary>,
      default() {
        return {};
      },
    },

    height: {
      type: String,
      default() {
        return '120px';
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    type: {
      type: String,
      default() {
        return '';
      },
    },
    loadend: {
      type: Boolean,
      default() {
        return false;
      },
    },
    tips: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const typeImage = {
    vuln,
    license,
    other,
    configure,
  };
  const { t } = useI18n();
  // chartoptions
  const violationSummaryConfig = [
    {
      value: 0,
      name: 'projects.risk.high',
      key: 'high',
      itemStyle: {
        color: 'rgba(245, 63, 63, 1)',
      },
    },
    {
      value: 0,
      name: 'projects.risk.middle',
      key: 'medium',
      itemStyle: {
        color: 'rgba(255, 125, 0, 1)',
      },
    },
    {
      value: 0,
      name: 'projects.risk.low',
      key: 'low',
      itemStyle: {
        color: 'rgba(250, 220, 25, 1)',
      },
    },
  ];
  const dataList = computed(() => {
    const list = map(violationSummaryConfig, (item) => {
      item.value = props.data[item.key] || 0;
      return {
        ...item,
        value: props.data[item.key] || 0,
        name: t(item.name),
      };
    });
    return list;
  });
  const isPass = computed(() => {
    return every(violationSummaryConfig, (item) => !props.data[item.key]);
  });
</script>

<style lang="less" scoped>
  .bar-wrap {
    padding: 10px;
    background-color: rgba(242, 243, 245, 0.3);
    background-repeat: no-repeat;
    // background-image: url('../images/vuln.png');
    background-position: center center;
    background-size: 96px 96px;
    border-radius: 4px;

    .pass {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #23c343;
      font-size: 80px;
      // background-image: url('../images/pass.png');
      // background-position:  center center;
      // background-repeat: no-repeat;
      // background-size: 80px 80px;
    }

    .title {
      margin-bottom: 10px;
      color: var(--color-text-2);
      font-weight: 500;
      text-align: left;

      .text {
        margin-right: 2px;
      }
    }
  }
</style>
