<template>
  <div class="history-wrap">
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="version"
          :title="$t('applications.applications.history.version')"
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
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="operator"
          :title="$t('applications.applications.history.operator')"
        >
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleClone(record)">
                <!-- <template #icon><icon-edit /></template> -->
                {{ $t('applications.applications.history.clone') }}
              </a-link>
              <a-link type="text" size="small" @click="handleRollback(record)">
                <!-- <template #icon><icon-list style="font-size: 16px" /></template> -->
                {{ $t('applications.applications.history.rollback') }}
              </a-link>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { HistoryData } from '../config/interface';

  const dataList = ref<HistoryData[]>([
    { version: 'v1.0', operator: 'Jackson', createTime: '2023-02-06' },
    { version: 'v1.2', operator: 'Tomson', createTime: '2023-02-07' }
  ]);
  const handleClone = (row) => {
    console.log(row);
  };
  const handleRollback = (row) => {
    console.log(row);
  };
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>
