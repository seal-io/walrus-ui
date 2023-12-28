<template>
  <div top-gap class="workflows-list">
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 240px"
          :placeholder="$t('common.search.name.placeholder')"
          @clear="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-space style="margin-left: 0" :size="10">
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
            actions: [Actions.POST]
          }"
          type="primary"
          @click="handleCreate"
          >{{ $t('cost.analyse.table.create') }}</a-button
        >
        <a-button
          v-permission="{
            resource: `roles.${Resources.Perspectives}`,
            actions: [Actions.DELETE]
          }"
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete')
          }}<span v-if="selectedKeys.length">{{
            `(${selectedKeys.length})`
          }}</span></a-button
        >
      </template>
    </FilterBox>
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :pagination="false"
      row-key="id"
      :row-selection="
        userStore.hasRolesActionsPermission({
          resource: Resources.Perspectives,
          actions: [Actions.DELETE]
        })
          ? rowSelection
          : null
      "
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
            $t('common.table.name.list', {
              type: $t('cost.analyse.table.manage')
            })
          "
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: '',
            sorter: true,
            sortOrder: sortDataIndex === 'name' ? sortOrder : ''
          }"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasRolesActionsPermission({
                  resource: Resources.Costs,
                  actions: [Actions.POST]
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
          align="left"
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
          align="left"
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
              dayjs(record?.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="
            userStore.hasRolesActionsPermission({
              resource: Resources.Perspectives,
              actions: [Actions.PUT]
            })
          "
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
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
    </a-table>
    <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="total <= 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import _, { map, find, toLower, pickBy, includes } from 'lodash';
  import { COSTMANAGEMENT } from '@/router/config';
  import { Actions, Resources } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import FilterBox from '@/components/filter-box/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { PerspectiveRowData } from '../config/interface';
  import { queryPerspectives, deletePerspectives } from '../api';
  import {
    DateShortCuts,
    builtinViewMap,
    VIEW_MAP,
    builtinViewList,
    actionList
  } from '../config';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  let timer: any = null;
  const loading = ref(false);
  const showDrawer = ref(false);
  const total = ref(0);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });
  const dataList = ref<PerspectiveRowData[]>([]);
  const getTimeValue = (val) => {
    const data = find(DateShortCuts, (item) => item.timeControl === val);
    return data ? t(data.label) : val;
  };
  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return item.filterFun ? item.filterFun({ itemInfo: row }) : true;
    });
    // const res = _.map(list, (o) => {
    //   const item = _.cloneDeep(o);
    //   item.disabled = _.isFunction(item.disabled)
    //     ? item.disabled?.(row)
    //     : item.disabled;
    //   return item;
    // });
    return list;
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
        item.labelFlag = includes(builtinViewList, item.name)
          ? toLower(item.name)
          : VIEW_MAP.custom;
        return item;
      });
      total.value = data?.pagination.total || 0;
      loading.value = false;
    } catch (error) {
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
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };
  const handleCreate = () => {
    // showDrawer.value = true;
    router.push({
      name: COSTMANAGEMENT.Edit,
      params: {
        action: 'edit'
      }
    });
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deletePerspectives({ items: ids });
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
    router.push({
      name: COSTMANAGEMENT.Edit,
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
      name: COSTMANAGEMENT.Edit,
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
      name: COSTMANAGEMENT.Main,
      query: {
        id: row.id,
        page: row.builtin ? toLower(row.name) : VIEW_MAP.custom
      }
    });
  };
  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };
  const handleClickAction = (value, row) => {
    switch (value) {
      case 'edit':
        handleEdit(row);
        break;
      case 'delete':
        handleDelete([row.id]);
        break;
      default:
        break;
    }
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
