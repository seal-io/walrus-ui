<template>
  <div class="workflows-list">
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelection"
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="id"
          :title="$t('operation.templates.menu')"
        >
          <template #cell="{ record }">
            <a-link size="small" @click="handleView(record)">{{
              record.id
            }}</a-link>
          </template>
        </a-table-column>

        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="description"
          :title="$t('common.table.description')"
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
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: get(record, 'status'),
                text: get(record, 'status'),
                message: get(record, 'statusMessage'),
                transitioning: get(record, 'status') === 'Initializing',
                error: get(record, 'status') === 'Error'
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
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
            sorter: true,
            sortOrder: sortOrder
          }"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link type="text" size="small" @click="handleEdit(record)">
                  <template #icon><icon-edit class="size-14" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.refresh')">
                <a-link type="text" size="small" @click="handlRefresh(record)">
                  <template #icon><icon-refresh /></template>
                </a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="queryParams.perPage === 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    /> -->
  </div>
</template>

<script lang="ts" setup>
  import { map, get } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { TemplateRowData } from '../config/interface';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { queryModules, refreshModules, deleteModules } from '../api';

  const props = defineProps({
    list: {
      type: Array as PropType<TemplateRowData[]>,
      default() {
        return [];
      }
    },
    selectedList: {
      type: Array as PropType<Array<string | number>>,
      default() {
        return [];
      }
    }
  });
  type BaseType = string | number;
  const emits = defineEmits(['update:selectedList']);
  const { rowSelection, selectedKeys } = useRowSelect();
  const { router } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    // type: '',
    id: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<TemplateRowData[]>([]);

  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await queryModules({
        ...queryParams,
        sort: [sort.value]
      });
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      loading.value = false;
    } finally {
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
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
    queryParams.id = '';
    queryParams.page = 1;
    handleFilter();
  };
  const handleSelectChange = (list: BaseType[]) => {
    rowSelection.selectedRowKeys = [...list];
    setTimeout(() => {
      emits('update:selectedList', list);
    }, 100);
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
  const handleCreate = () => {
    router.push({ name: 'TemplateDetail' });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteModules(ids);
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
    router.push({
      name: 'TemplateDetail',
      params: { action: 'edit' },
      query: { id: row.id }
    });
  };
  const handleView = (row) => {
    router.push({
      name: 'TemplateDetail',
      params: { action: 'view' },
      query: { id: row.id }
    });
  };
  const handlRefresh = async (row) => {
    try {
      await refreshModules({ id: row.id });
      execSucceed();
    } catch (error) {
      console.log('error');
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const clearSelection = () => {
    selectedKeys.value = [];
    rowSelection.selectedRowKeys = [];
  };
  defineExpose({
    clearSelection
  });
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped></style>
