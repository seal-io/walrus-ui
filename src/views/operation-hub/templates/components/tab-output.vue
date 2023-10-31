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
  import { get } from 'lodash';
  import { PropType, computed } from 'vue';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
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
    const result = initFormState(
      get(props.schema, 'internalSchema.schema.components.schemas.outputs')
    );
    return result.fieldSchemaList || [];
  });
</script>

<style lang="less" scoped></style>
