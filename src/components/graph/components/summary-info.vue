<template>
  <div class="summary-info">
    <div class="sub-title">{{ $t('graph.resource.summary.title') }}</div>
    <div class="content">
      <div class="item">
        <div class="title">{{
          $t('graph.resource.summary.type', { total: dataTotal })
        }}</div>
        <div class="tag-wrap">
          <a-tag
            v-for="item in resourceSummary"
            :key="item.label"
            :color="`rgb(${get(dataColorMap, item.type)})`"
          >
            <span>{{ $t(item.label || '') }}{{ `(${item.value})` }}</span>
          </a-tag>
        </div>
        <div class="title"
          >{{ $t('graph.resource.summary.vuln', { total: vulnTotal }) }})</div
        >
        <div class="tag-wrap">
          <a-tag
            v-for="item in severitySumamry"
            :key="item.label"
            :class="{ none: toLower(item.type) === 'none' }"
            :color="`rgb(${get(severityColorValueMap, toLower(item.type))})`"
            >{{ $t(item.label || '') }}{{ `(${item.value})` }}</a-tag
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { get, keys, capitalize, map, toLower, reduce } from 'lodash';
  import { computed, PropType } from 'vue';
  import { severityMaps, severityColorValueMap } from '@/config/global';
  import { dataColorMap } from '../config';

  interface Option {
    label: string;
    value: string;
    type?: string;
    total?: number;
  }
  const props = defineProps({
    summaryInfo: {
      type: Object as PropType<Option[]>,
      default() {
        return [];
      },
    },
    severityDataInfo: {
      type: Object as PropType<Option[]>,
      default() {
        return [];
      },
    },
  });

  const resourceSummary = computed(() => {
    const list = map(props.summaryInfo, (item) => {
      return {
        label: item.label,
        value: item.total,
        type: item.value,
      };
    });
    return list;
  });
  const severitySumamry = computed(() => {
    const list = map(props.severityDataInfo, (item) => {
      return {
        label: item.label,
        value: item.total,
        type: item.value,
      };
    });
    return list;
  });
  const vulnTotal = computed(() => {
    const result = reduce(
      props.severityDataInfo,
      (total, item) => {
        total += item.total || 0;
        return total;
      },
      0
    );
    return result;
  });
  const dataTotal = computed(() => {
    const result = reduce(
      props.summaryInfo,
      (total, item) => {
        total += item.total || 0;
        return total;
      },
      0
    );
    return result;
  });
</script>

<style lang="less" scoped>
  .summary-info {
    .content {
      padding: 5px;
    }

    .sub-title {
      padding: 10px 5px;
      color: #fff;
      font-weight: 500;
      font-size: 13px;
      background: rgb(var(--primary-6));
    }

    .item {
      .title {
        margin-top: 10px;
        color: var(--color-text-2);
        font-weight: 500;
        font-size: 13px;
      }
    }

    .tag-wrap {
      display: inline-flex;
      flex-wrap: wrap;
      margin-top: 10px;
      font-size: 14px;

      .arco-tag {
        display: inline-block;
        min-width: 30px;
        height: 20px;
        margin-right: 5px;
        margin-bottom: 5px;
        padding: 0 5px;
        // color: var(--color-text-3);
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        text-align: center;
        border-radius: 10px;

        &.none {
          color: var(--color-text-2);
        }
      }
    }
  }
</style>
