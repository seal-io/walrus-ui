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
          align="center"
          data-index="type"
          :title="$t('operation.connectors.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{ record.createTime }}</span>
          </template>
        </a-table-column>
        <a-table-column
          align="center"
          :width="160"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record, rowIndex }">
            <a-space :size="20">
              <a-link
                type="text"
                size="small"
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
  import { map } from 'lodash';
  import { reactive, ref, onMounted, PropType, watchEffect } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { ConnectorRowData } from '../../connectors/config/interface';

  const props = defineProps({
    list: {
      type: Array as PropType<ConnectorRowData[]>,
      default() {
        return [];
      }
    }
  });
  const emits = defineEmits(['delete']);
  const loading = ref(false);
  const selectedKeys = ref([]);

  const handleDeleteConfirm = async (record, rowIndex) => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      emits('delete', record, rowIndex);
      loading.value = false;
      // execSucceed();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };

  const handleDelete = async (record, rowIndex) => {
    deleteModal({ onOk: handleDeleteConfirm(record, rowIndex) });
  };
  onMounted(() => {
    console.log('application list');
  });
</script>

<style lang="less" scoped></style>
