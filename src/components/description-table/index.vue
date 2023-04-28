<template>
  <a-table
    class="description-table"
    style="margin-bottom: 10px；"
    :bordered="true"
    :data="dataList"
    :pagination="false"
    :virtual-list-props="{
      height: dataList.length > 10 ? 400 : 43 * dataList.length
    }"
  >
    <template #columns>
      <a-table-column
        ellipsis
        tooltip
        :width="200"
        :cell-style="{ minWidth: '40px' }"
        data-index="key"
        :title="$t('common.input.key')"
      >
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
            <span>{{ record.value }}</span>
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
