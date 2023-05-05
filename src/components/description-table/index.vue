<template>
  <a-table
    class="description-table"
    style="margin-bottom: 10px；"
    :bordered="true"
    :data="dataList"
    :pagination="false"
    :virtual-list-props="{
      height: 43 * dataList.length > 400 ? 400 : 300
    }"
  >
    <template #columns>
      <a-table-column
        ellipsis
        tooltip
        :width="220"
        :cell-style="{ minWidth: '40px' }"
        data-index="key"
        :title="$t('common.input.key')"
      >
        <template #cell="{ record }">
          <AutoTip
            style="width: 200px"
            :tooltip-props="{
              content: record.key
            }"
          >
            <span>{{ record.key }}</span>
          </AutoTip>
        </template>
      </a-table-column>
      <a-table-column
        ellipsis
        tooltip
        :cell-style="{ minWidth: '40px' }"
        data-index="value"
        :title="$t('common.input.value')"
      >
        <template #cell="{ record }">
          <slot name="value" :row="{ ...record }" :value="record.value">
            <span>{{ record.sensitive ? '******' : record.value }}</span>
          </slot>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  interface RowData {
    key: string;
    value: string;
    description?: string;
    sensitive?: boolean;
  }
  defineProps({
    dataList: {
      type: Array as PropType<RowData[]>,
      default() {
        return [];
      }
    }
  });
</script>

<style lang="less" scoped>
  .description-table {
    :deep(.arco-table-element) {
      width: auto;
    }

    :deep(.arco-virtual-list) {
      &.arco-table-body {
        overflow-x: hidden !important;
      }
    }

    :deep(.arco-table-tr) {
      .arco-table-th {
        background-color: #fff;
        border-bottom: 1px solid var(--color-border-2);

        &::after {
          display: none;
        }
      }

      .arco-table-td {
        background-color: #fff;
      }
    }
  }
</style>
