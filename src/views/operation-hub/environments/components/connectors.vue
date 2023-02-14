<template>
  <div class="connectors-list">
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="true"
      :loading="loading"
      :data="dataList"
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
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleDelete(record)">
                <template #icon><icon-edit /></template>
                {{ $t('common.button.delete') }}
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
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { ConnectorRowData } from '../../connectors/config/interface';

  const { router } = useCallCommon();
  const loading = ref(false);
  const selectedKeys = ref([]);
  const dataList = ref<ConnectorRowData[]>([
    {
      id: '1',
      name: 'connector-1',
      createTime: '2023-02-09',
      type: 'EKS',
      status: 'ready'
    },
    {
      id: '2',
      name: 'connector-1',
      createTime: '2023-02-09',
      type: 'EKS',
      status: 'unconnected'
    }
  ]);

  const fetchData = async () => {};
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      // await deleteRepos(ids);
      loading.value = false;
      execSucceed();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };

  const handleDelete = async (row) => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    console.log('application list');
  });
</script>

<style lang="less" scoped></style>
