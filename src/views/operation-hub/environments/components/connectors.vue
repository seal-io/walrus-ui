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
          data-index="status"
          :title="$t('operation.connectors.table.status')"
        >
          <template #cell="{ record }">
            <span v-if="record.category === 'Custom'">-</span>
            <StatusLabel
              v-else
              :status="{
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
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{ dayjs(record.createTime).format('YYYY-MM-DD') }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="action === 'edit'"
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
  import { map, get } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted, PropType, watchEffect } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { ConnectorRowData } from '../../connectors/config/interface';
  import StatusLabel from '../../connectors/components/status-label.vue';

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
  const selectedKeys = ref([]);

  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      emits('delete', record.value, rowIndex.value);
      loading.value = false;
      // execSucceed();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };

  const handleDelete = async (row, index) => {
    record.value = row;
    rowIndex.value = index;
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    console.log('application list');
  });
</script>

<style lang="less" scoped></style>
