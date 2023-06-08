<template>
  <div top-gap class="workflows-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 240px"
          :placeholder="$t('cost.analyse.table.holder')"
          @clear="handleSearch"
          @change="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
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
        <a-button
          v-permission="{
            resource: `roles.${Resources.Perspectives}`,
            actions: ['POST']
          }"
          type="primary"
          @click="handleCreate"
          >{{ $t('cost.analyse.table.create') }}</a-button
        >
        <a-button
          v-permission="{
            resource: `roles.${Resources.Perspectives}`,
            actions: ['DELETE']
          }"
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
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('cost.analyse.table.manage')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasRolesActionsPermission({
                  resource: Resources.Costs,
                  actions: ['POST']
                })
              "
              size="small"
              @click="handleView(record)"
              >{{
                record.builtin
                  ? $t(builtinViewMap[toLower(record.name)])
                  : record.name
              }}</a-link
            >
            <span v-else>{{
              record.builtin
                ? $t(builtinViewMap[toLower(record.name)])
                : record.name
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="builtin"
          :title="$t('cost.analyse.table.type')"
        >
          <template #cell="{ record }">
            <span>{{
              record.builtin
                ? $t('cost.analyse.table.builtin')
                : $t('cost.analyse.table.custom')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="startTime"
          :title="$t('cost.analyse.table.time')"
        >
          <template #cell="{ record }">
            <span>{{ getTimeValue(record?.startTime) }}</span>
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
              dayjs(record?.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-tooltip
                v-if="!record.builtin"
                :content="$t('common.button.edit')"
              >
                <a-link type="text" size="small" @click="handleEdit(record)">
                  <template #icon><icon-edit class="size-16" /></template>
                </a-link>
              </a-tooltip>
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
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { map, find, toLower, pickBy, includes } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { PerspectiveRowData } from '../config/interface';
  import { queryPerspectives, deletePerspectives } from '../api';
  import { DateShortCuts, builtinViewMap } from '../config';

  const userStore = useUserStore();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  let timer: any = null;
  const loading = ref(false);
  const showDrawer = ref(false);
  const total = ref(0);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<PerspectiveRowData[]>([]);
  const getTimeValue = (val) => {
    const data = find(DateShortCuts, (item) => item.timeControl === val);
    return data ? t(data.label) : val;
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryPerspectives(params);
      const list = data?.items || [];
      dataList.value = map(list, (item) => {
        item.disabled = item.builtin;
        item.labelFlag = includes(['ALL', 'Cluster', 'Project'], item.name)
          ? toLower(item.name)
          : 'custom';
        return item;
      });
      total.value = data?.pagination.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    console.log('dataIndex===', dataIndex, direction);
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
    queryParams.query = '';
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
  const handleCreate = () => {
    // showDrawer.value = true;
    router.push({
      name: 'CostPerspectiveEdit',
      params: {
        action: 'edit'
      }
    });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deletePerspectives(ids);
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
      name: 'CostPerspectiveEdit',
      params: {
        action: 'edit'
      },
      query: {
        id: row.id
      }
    });
  };
  const handleViewPerspective = (row) => {
    router.push({
      name: 'CostPerspectiveEdit',
      params: {
        action: 'view'
      },
      query: {
        id: row.id,
        builtin: row.builtin || false
      }
    });
  };
  const handleView = (row) => {
    // let routeName = 'costAnalyseAll';
    // if (capitalize(row.name) === 'Cluster') {
    //   routeName = 'costAnalyseCluster';
    // }
    // if (capitalize(row.name) === 'Project') {
    //   routeName = 'costAnalyseProject';
    // }
    // if (!row.builtin) {
    //   routeName = 'costAnalyseCustom';
    // }
    router.push({
      name: 'CostPerspective',
      query: { id: row.id, page: row.builtin ? toLower(row.name) : 'custom' }
    });
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    fetchData();
  });
</script>

<script lang="ts">
  export default {
    name: 'CostAnalyseList'
  };
</script>

<style lang="less" scoped></style>
