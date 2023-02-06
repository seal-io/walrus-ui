<template>
  <div class="score-card-wrap">
    <a-descriptions
      layout="vertical"
      :value-style="{
        'text-align': 'center',
        'padding': 0,
        'color': '#fff',
      }"
      :label-style="{ 'text-align': 'center' }"
      :data="dataList"
      :column="cols"
      :title="title"
    >
      <template #value="{ value, data }">
        <div :style="{ background: data.color }">{{ $t(value) }}</div>
      </template>
      <template #label="{ data }">
        <div>
          <span>{{ $t(data.localeLabel) }}</span>
          <a-tooltip>
            <template #content>
              <div>
                <div>{{ get(data, 'documentation.short') }}</div>
                <div><strong>Reason:</strong></div>
                <div>{{ get(data, 'reason') }}</div>
              </div>
            </template>
            <icon-question-circle
              style="margin-left: 2px; vertical-align: -3px"
            />
          </a-tooltip>
        </div>
      </template>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import { ScoreCardItem } from '../config/interface';

  defineProps({
    dataList: {
      type: Array as PropType<ScoreCardItem[]>,
      default() {
        return [];
      },
    },
    cols: {
      type: Number,
      default() {
        return 2;
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
  });
</script>

<style lang="less" scoped>
  .score-card-wrap {
    box-sizing: border-box;
    // padding: 10px;
    // border: 1px solid var(--color-neutral-3);
    // border-radius: var(--border-radius-medium);
    :deep(.arco-descriptions-item-label) {
      color: var(--color-text-2);
      background-color: #fff;
    }

    :deep(.arco-descriptions-item-value-block) {
      padding-bottom: 8px !important;
      // height: 30px;
    }

    :deep(.arco-descriptions-table) {
      border-collapse: separate;
      border-spacing: 6px 0;
    }
  }
</style>
