<template>
  <div class="history-wrap">
    <a-table
      column-resizable
      style="margin-bottom: 10px"
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
    <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="queryParams.perPage === 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue';
  import { HistoryData } from '../../config/interface';

  const total = ref(100);
  const queryParams = reactive({
    page: 1,
    perPage: 10
  });
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
  const fetchData = async () => {};
  const handleFilter = () => {
    fetchData();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    handleFilter();
  };
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>
