<template>
  <div class="tab-content-wrap">
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
          data-index="version_constraints"
          :title="$t('operation.templates.detail.version')"
        >
          <template #cell="{ record }">
            <span>{{ join(record.version_constraints, ', ') }}</span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { get, join } from 'lodash';
  import { PropType, computed } from 'vue';
  import { Schema } from '../config/interface';

  const props = defineProps({
    schema: {
      type: Object as PropType<Schema>,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default() {
        return '100%';
      }
    }
  });
  const dataList = computed(() => {
    const list = get(props.schema, 'schema.requiredProviders', []);
    return list || [];
  });
</script>

<style lang="less" scoped>
  .tab-content-wrap {
    :deep(.arco-textarea) {
      background-color: var(--color-fill-2);
    }
  }

  .tab-content-wrap {
    min-height: 200px;

    ul {
      padding-left: 30px;
    }
  }
</style>
