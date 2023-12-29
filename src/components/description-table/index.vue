<template>
  <div class="description-table">
    <a-table
      style="margin-bottom: 10px；"
      :bordered="false"
      :data="dataList"
      :pagination="false"
      :virtual-list-props="virtualProps"
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
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType, computed } from 'vue';

  interface RowData {
    key: string;
    value: string;
    description?: string;
    sensitive?: boolean;
  }
  const props = defineProps({
    dataList: {
      type: Array as PropType<RowData[]>,
      default() {
        return [];
      }
    }
  });
  const virtualProps = computed(() => {
    const h = _.reduce(
      props.dataList,
      (total, item) => {
        if (_.get(item, 'type') === 'dynamic' && _.get(item, 'value')) {
          total += 100;
        } else {
          total += 43;
        }
        return total;
      },
      0
    );
    const res: any = h > 400 ? { height: 400 } : null;
    return res;
  });
</script>

<style lang="less" scoped>
  .description-table {
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

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

      &:last-child {
        .arco-table-td {
          border-bottom: none;
        }
      }

      .arco-table-td {
        background-color: #fff;
      }

      .arco-table-cell {
        padding: 9px 10px;
      }
    }
  }
</style>
