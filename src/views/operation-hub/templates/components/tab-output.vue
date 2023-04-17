<template>
  <div class="output-content-wrap">
    <a-table
      column-resizable
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="Name"
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="Description"
          :title="$t('common.table.description')"
        >
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType, computed } from 'vue';
  import { Schema } from '../config/interface';

  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    }
  });
  const dataList = computed(() => {
    const list = get(props.schema, 'Outputs');
    return list || [];
  });
</script>

<style lang="less" scoped></style>
