<template>
  <ComCard top-gap class="workflows-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-select
          v-model="queryParams.projectId"
          allow-clear
          allow-search
          :options="projectList"
          style="width: 240px"
          :placeholder="$t('applications.projects.search.holder')"
          @clear="handleSearch"
          @change="handleSearch"
        >
        </a-select>
        <a-space style="margin-left: 10px">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <a-button type="primary" @click="handleCreate">{{
          $t('applications.workflows.create')
        }}</a-button>
        <a-button
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </template>
    </FilterBox>
    <!-- <a-divider :margin="8"></a-divider> -->
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelection"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('applications.applications.table.name')"
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
          data-index="service"
          :title="$t('applications.applications.table.service')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="status"
          :title="$t('applications.applications.table.status')"
        >
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" :href="handleEdit(record)">
                <template #icon><icon-edit /></template>
                <!-- {{ $t('common.button.edit') }} -->
              </a-link>
              <a-link type="text" size="small" :href="handleView(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                <!-- {{ $t('common.button.detail') }} -->
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { map } from 'lodash';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { AppRowData } from '../config/interface';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    projectId: '1',
    page: 1,
    perPage: 10
  });
  const dataList = ref<AppRowData[]>(
    Array(10).fill({
      name: 'app-1',
      createTime: '2023-02-09',
      service: 3,
      status: 'ready'
    })
  );
  const projectList = ref<{ label: string; value: string }[]>([
    { label: 'project1', value: '1' },
    { label: 'project2', value: '2' },
    { label: 'project3', value: '3' }
  ]);
  const fetchData = async () => {};
  const handleFilter = () => {
    fetchData();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.projectId = '';
    queryParams.page = 1;
    handleFilter();
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
  const handleCreate = () => {};
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
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleEdit = (row) => {
    // const path = router.resolve({ name: 'eventReport', query: { id: row.id } });
    return '';
  };
  const handleView = (row) => {
    // const path = router.resolve({ name: 'eventReport', query: { id: row.id } });
    return '';
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    console.log('workflows');
  });
</script>

<style lang="less" scoped></style>
