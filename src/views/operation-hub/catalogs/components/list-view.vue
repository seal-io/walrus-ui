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
          data-index="name"
          :title="$t('catalogs.list.name')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasRolesActionsPermission({
                  resource: Resources.Templates,
                  actions: [Actions.PUT]
                })
              "
              size="small"
              @click="handleEdit(record)"
              >{{ record.name }}</a-link
            >
            <span v-else>{{ record.name }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="sync.total"
          :title="$t('catalogs.list.total')"
        >
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
              :zoom="0.9"
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
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="sync.time"
          :title="$t('catalogs.list.sync.time')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.sync?.time).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="16">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  v-permission="{
                    resource: `roles.${Resources.Templates}`,
                    actions: [Actions.PUT]
                  }"
                  type="text"
                  size="small"
                  @click="handleEdit(record)"
                >
                  <template #icon><icon-edit class="size-14" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.refresh')">
                <a-link
                  v-permission="{
                    resource: `roles.${Resources.Templates}`,
                    actions: [Actions.PUT]
                  }"
                  type="text"
                  size="small"
                  @click="handlRefresh(record)"
                >
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
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { PageAction } from '@/views/config';
  import { map, get } from 'lodash';
  import dayjs from 'dayjs';
  import { useUserStore } from '@/store';
  import { reactive, ref, onMounted, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { CatalogRowData } from '../config/interface';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { queryCatalogs, refreshCatalog, deleteCatalogs } from '../api';

  const props = defineProps({
    list: {
      type: Array as PropType<CatalogRowData[]>,
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
  const emits = defineEmits([
    'update:selectedList',
    'update:sort',
    'sort',
    'edit'
  ]);
  const userStore = useUserStore();
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
  const dataList = ref<CatalogRowData[]>([]);

  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await queryCatalogs({
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
    emits('update:sort', sort.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      emits('sort');
    }, 100);
    // fetchData();
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

  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteCatalogs(ids);
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
    emits('edit', row);
  };
  const handleView = (row) => {
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      params: { action: PageAction.VIEW },
      query: { id: row.id }
    });
  };
  const handlRefresh = async (row) => {
    try {
      await refreshCatalog({ id: row.id });
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
    // fetchData();
  });
</script>

<style lang="less" scoped></style>
