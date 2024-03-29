<template>
  <div class="connectors-list">
    <a-table
      column-resizable
      :bordered="true"
      :loading="loading"
      :data="list"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('operation.connectors.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="type"
          :title="$t('operation.connectors.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="status"
          :title="$t('operation.connectors.table.status')"
        >
          <template #cell="{ record }">
            <span v-if="record.category === ConnectorCategory.Custom">-</span>
            <StatusLabel
              v-else
              :status-detail="{
                status: get(record, 'status.summaryStatus'),
                text: get(record, 'status.summaryStatus'),
                message: get(record, 'status.summaryStatusMessage'),
                transitioning: get(record, 'status.transitioning'),
                error: get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          v-if="action === 'edit'"
          align="left"
          :width="160"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record, rowIndex }">
            <a-space :size="20">
              <a-link
                type="text"
                size="small"
                status="danger"
                @click="handleDelete(record, rowIndex)"
              >
                <template #icon><icon-delete class="size=20" /></template>
              </a-link>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { ref, PropType } from 'vue';
  import { deleteModal } from '@/utils/monitor';
  import { ConnectorRowData } from '@/views/operation-hub/connectors/config/interface';
  import { ConnectorCategory } from '@/views/operation-hub/connectors/config';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';

  const props = defineProps({
    list: {
      type: Array as PropType<ConnectorRowData[]>,
      default() {
        return [];
      }
    },
    action: {
      type: String,
      default() {
        return 'edit';
      }
    }
  });
  const emits = defineEmits(['delete']);
  const loading = ref(false);
  const record = ref<any>({});
  const rowIndex = ref(undefined);

  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      emits('delete', record.value, rowIndex.value);
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };

  const handleDelete = async (row, index) => {
    record.value = row;
    rowIndex.value = index;
    deleteModal({ onOk: handleDeleteConfirm });
  };
</script>

<style lang="less" scoped>
  .connectors-list {
    :deep(.arco-table-container) {
      overflow: hidden;
      border: 1px solid var(--color-neutral-3);
      border-radius: var(--border-radius-small);

      .arco-table-tr:last-child .arco-table-td {
        border-bottom: none;
      }
    }

    :deep(.arco-table) {
      .arco-table-tr.arco-table-tr-empty .arco-table-td {
        border-bottom: none;
      }
    }
  }
</style>
