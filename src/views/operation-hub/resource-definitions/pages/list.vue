<template>
  <comCard borderless padding="0">
    <div class="connectors-list">
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 200px"
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
            v-if="
              userStore.hasRolesActionsPermission({
                resource: Resources.ResourceDefinitions,
                actions: [Actions.POST]
              })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('resource.definition.list.create') }}</a-button
          >
          <a-button
            v-if="
              userStore.hasRolesActionsPermission({
                resource: Resources.ResourceDefinitions,
                actions: [Actions.DELETE]
              })
            "
            type="primary"
            status="warning"
            :disabled="!selectedKeys.length"
            @click="() => handleDelete()"
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
        :row-selection="rowSelectionStatue"
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
              $t('common.table.name.list', {
                type: $t('resource.definition.list.name')
              })
            "
            cell-class="clickable"
            :sortable="{
              sortDirections: ['ascend', 'descend'],
              defaultSortOrder: '',
              sorter: true,
              sortOrder: sortDataIndex === 'name' ? sortOrder : ''
            }"
          >
            <template #cell="{ record }">
              <span v-if="record.builtin"></span>
              <a-link v-else size="small" :hoverable="false">{{
                record.name
              }}</a-link>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            align="left"
            :cell-style="{ minWidth: '40px' }"
            data-index="type"
            :title="$t('common.table.type')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="description"
            :title="$t('common.table.description')"
          >
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
            v-if="
              userStore.hasRolesActionsPermission({
                resource: Resources.ResourceDefinitions,
                actions: [Actions.PUT]
              })
            "
            align="left"
            :width="210"
            :title="$t('common.table.operation')"
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
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
  </comCard>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import dayjs from 'dayjs';
  import { OPERATIONHUB } from '@/router/config';
  import { PageAction } from '@/views/config';
  import _, { cloneDeep, map, pickBy } from 'lodash';
  import { reactive, ref, onMounted, computed, nextTick, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import { ResourceDefinitionRowData } from '../config/interface';
  import {
    queryResourceDefinitions,
    deleteResourceDefinitions,
    RESOURCE_DEFINITION_API
  } from '../api';
  import { actionList } from '../config';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t, route } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);

  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10,
    extract: ['-uiSchema', '-schema']
  });
  const dataList = ref<ResourceDefinitionRowData[]>([]);

  const { updateChunkedList } = useUpdateChunkedList(dataList);

  const rowSelectionStatue = computed(() => {
    return userStore.hasRolesActionsPermission({
      resource: Resources.ResourceDefinitions,
      actions: [Actions.PUT]
    })
      ? rowSelection
      : null;
  });

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
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryResourceDefinitions(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
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

  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
    if (!dataList.value.length) {
      queryParams.page = 1;
      handleFilter();
    }
  };

  const createTemplateChunkRequest = () => {
    try {
      setChunkRequest({
        url: RESOURCE_DEFINITION_API,
        params: {
          ..._.pickBy(_.omit(queryParams, ['page', 'perPage']), (val) => !!val)
        },
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };

  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
    nextTick(() => {
      createTemplateChunkRequest();
    });
  };

  const handleView = (row) => {
    router.push({
      name: OPERATIONHUB.ResourceDefinitionDetail,
      params: {
        action: PageAction.VIEW
      },
      query: {
        id: row.id
      }
    });
  };
  const handleCellClick = (row, column) => {
    if (column.dataIndex === 'name' && !row.builtin) {
      handleView(row);
    }
  };
  const handleReset = () => {
    queryParams.query = '';
    queryParams.page = 1;
    handleFilter();
    nextTick(() => {
      createTemplateChunkRequest();
    });
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
    router.push({
      name: OPERATIONHUB.ResourceDefinitionDetail,
      params: {
        action: PageAction.EDIT
      }
    });
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val as string
        };
      });
      await deleteResourceDefinitions({
        items: ids
      });
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

  const handleClickEdit = (row) => {
    router.push({
      name: OPERATIONHUB.ResourceDefinitionDetail,
      params: {
        action: PageAction.EDIT
      },
      query: {
        id: row.id
      }
    });
  };

  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };

  const handleClickAction = (value, row) => {
    switch (value) {
      case 'edit':
        handleClickEdit(row);
        break;
      case 'delete':
        handleDelete([row.id]);
        break;
      default:
        break;
    }
  };
  onMounted(async () => {
    fetchData();
    nextTick(() => {
      createTemplateChunkRequest();
    });
  });
</script>

<style lang="less" scoped>
  .connectors-list {
    :deep(.arco-table) {
      .visible {
        padding-bottom: 3px;
      }

      .invisible {
        padding-top: 2px;
      }
    }
  }
</style>
