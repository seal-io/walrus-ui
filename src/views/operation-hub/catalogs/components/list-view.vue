<template>
  <div class="workflows-list">
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelectionRef"
      @cell-click="handleCellClick"
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="
            $t('common.table.name.list', { type: $t('catalogs.list.name') })
          "
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: '',
            sorter: true,
            sortOrder: sortDataIndex === 'name' ? sortOrder : ''
          }"
        >
          <template #cell="{ record }">
            <a-link :hoverable="false">{{ record.name }}</a-link>
          </template>
        </a-table-column>

        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="sync.total"
          :title="$t('catalogs.list.total')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="description"
          :title="$t('common.table.description')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="status"
          :title="$t('applications.applications.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :zoom="0.9"
              :status="get(record, 'status', {})"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="createTime"
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
            sorter: true,
            sortOrder: sortDataIndex === 'createTime' ? sortOrder : ''
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
          align="left"
          data-index="sync.time"
          :title="$t('catalogs.list.sync.time')"
        >
          <template #cell="{ record }">
            <span>{{
              record.sync?.time
                ? dayjs(record.sync?.time).format('YYYY-MM-DD HH:mm:ss')
                : '-'
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="
            route.params.projectId
              ? userStore.hasProjectResourceActions({
                  resource: Resources.Catalogs,
                  projectID: route.params.projectId,
                  actions: [Actions.PUT]
                })
              : userStore.hasRolesActionsPermission({
                  resource: Resources.Catalogs,
                  actions: [Actions.PUT]
                })
          "
          align="left"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <DropButtonGroup
              v-if="setActionList(record).length"
              :layout="
                setActionList(record).length === 1 ? 'horizontal' : 'vertical'
              "
              :actions="setActionList(record)"
              @select="(value) => handleClickAction(value, record)"
            ></DropButtonGroup>
          </template>
        </a-table-column>
      </template>
      <template #empty>
        <slot name="empty"></slot>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import _, { map, get } from 'lodash';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { PageAction } from '@/views/config';
  import dayjs from 'dayjs';
  import { useUserStore } from '@/store';
  import { reactive, ref, onMounted, PropType, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { CatalogRowData } from '../config/interface';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { queryCatalogs, refreshCatalog, deleteCatalogs } from '../api';
  import { actionList } from '../config';
  import { emitFilterCatalogAction } from '../../hooks/filter-catalog-listener';

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
  const { router, route } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
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

  const rowSelectionRef = computed(() => {
    if (route.params.projectId) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Catalogs,
        projectID: route.params.projectId,
        actions: [Actions.DELETE]
      })
        ? rowSelection
        : null;
    }
    return userStore.hasRolesActionsPermission({
      resource: Resources.Catalogs,
      actions: [Actions.DELETE]
    })
      ? rowSelection
      : null;
  });

  const handleCellClick = (row, col) => {
    if (col.dataIndex === 'name') {
      emitFilterCatalogAction(row);
    }
  };

  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return item.filterFun ? item.filterFun(row) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(row)
        : item.disabled;
      return item;
    });
    return res;
  };

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
    console.log({ sort: sort.value, dataIndex, direction });
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
      await deleteCatalogs({ items: ids });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
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
      query: { id: row.id, name: row.name }
    });
  };
  const handlRefresh = async (row) => {
    try {
      await refreshCatalog({ id: row.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };

  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };

  const handleClickAction = (value, row) => {
    switch (value) {
      case 'edit':
        handleEdit(row);
        break;
      case 'refresh':
        handlRefresh(row);
        break;
      case 'delete':
        selectedKeys.value = [row.id];
        handleDelete();
        break;
      default:
        break;
    }
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
