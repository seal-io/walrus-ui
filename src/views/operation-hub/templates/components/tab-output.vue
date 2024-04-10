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
          data-index="name"
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="description"
          :title="$t('common.table.description')"
        >
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import _, { get } from 'lodash';
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
    const list: any[] = [];
    const result = get(
      props.schema,
      'openAPISchema.components.schemas.outputs.properties'
    );
    _.each(_.keys(result), (key) => {
      list.push({
        name: key,
        description: get(result, `${key}.description`, '')
      });
    });
    return list;
  });
</script>

<style lang="less" scoped></style>
