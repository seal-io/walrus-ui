<template>
  <div class="connectors-list">
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-select
          v-model="queryParams.category"
          allow-clear
          style="width: 220px"
          :placeholder="$t('operation.connectors.category.holder')"
          @clear="handleSearch"
          @change="handleSearch"
        >
          <a-option
            v-for="item in connectorTypeList"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          >
            <i
              class="iconfont size-14 mright-5"
              :class="item.icon"
              style="color: var(--sealblue-6)"
            ></i>
            {{ $t(item.label) }}
          </a-option>
        </a-select>
        <a-input
          v-model.trim="queryParams.query"
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
        <primaryButtonGroup
          v-if="hasPutPermission"
          size="medium"
          :actions="connectorTypeList"
          position="br"
          trigger="hover"
          item-type="text"
          @select="(value, item) => handleCreate(value, item)"
        >
          <a-button type="primary"
            >{{ $t('operation.connectors.create')
            }}<icon-down style="stroke-width: 5" class="font-14 mleft-5"
          /></a-button>
        </primaryButtonGroup>
        <a-button
          v-if="hasDeletePermission"
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
      :row-selection="rowSelectionState"
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
              type: $t('operation.connectors.table.connector')
            })
          "
          :cell-class="isLocalConnectorType('category') ? 'clickable' : ''"
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: '',
            sorter: true,
            sortOrder: sortDataIndex === 'name' ? sortOrder : ''
          }"
        >
          <template #cell="{ record }">
            <a-link
              v-if="isLocalConnectorType(record.category)"
              type="text"
              size="small"
              :hoverable="false"
            >
              {{ record.name }}
            </a-link>
            <span v-else>{{ record.name }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          align="left"
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="$t('operation.connectors.table.type')"
        >
          <template #cell="{ record }">
            <span
              v-if="_.includes([ConnectorCategory.Custom], record.category)"
              class="mright-5"
            >
              <icon-font
                type="icon-custom"
                class="size-16"
                style="color: rgb(var(--arcoblue-5))"
              ></icon-font>
            </span>
            <span v-else class="mright-5">
              <ProviderIcon :provider="toLower(record.type)"></ProviderIcon>
            </span>
            <span>{{ get(gitType, record.type) || record.type }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="finOpsStatus"
          :title="$t('operation.connectors.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              v-if="record.category !== ConnectorCategory.Custom"
              :status="get(record, 'status', {})"
            ></StatusLabel>
            <span v-else>-</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="applicableEnvironmentType"
          :title="$t('operation.connectors.table.environmentType')"
        >
          <template #cell="{ record }">
            <span>{{
              $t(EnvironmentTypeMap[record.applicableEnvironmentType] || '')
            }}</span>
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
          v-if="
            route.params.projectId
              ? userStore.hasProjectResourceActions({
                  resource: Resources.Connectors,
                  projectID: route.params.projectId,
                  actions: [Actions.PUT]
                })
              : userStore.hasRolesActionsPermission({
                  resource: Resources.Connectors,
                  actions: [Actions.PUT]
                })
          "
          align="left"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :width="210"
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
      <template #empty>
        <result-view
          :loading="loading"
          :title="
            queryParams.query
              ? $t('common.result.nodata.title', {
                  type: $t('operation.connectors.table.connector')
                })
              : $t('common.nodata.created', {
                  type: $t('operation.connectors.table.connector')
                })
          "
          :subtitle="
            queryParams.query ? $t('common.result.nodata.subtitle') : ''
          "
        >
          <template #icon>
            <icon-find-replace v-if="queryParams.query" />
            <i v-else class="iconfont icon-connector1"></i>
          </template>
          <template #extra>
            <primaryButtonGroup
              v-if="hasPutPermission && !queryParams.query"
              size="medium"
              :actions="connectorTypeList"
              position="br"
              trigger="hover"
              item-type="text"
              @select="(value, item) => handleCreate(value, item)"
            >
              <a-button type="outline">
                <icon-plus style="stroke-width: 5" class="font-14 mright-5" />
                {{ $t('common.button.create.now')
                }}<icon-down style="stroke-width: 5" class="font-14 mleft-5"
              /></a-button>
            </primaryButtonGroup>
          </template>
        </result-view>
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
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import { Resources, Actions } from '@/permissions/config';
  import { EnvironmentTypeMap } from '@/views/config';
  import { useUserStore, useAppStore } from '@/store';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import useAxiosSource from '@/hooks/use-axios-cancel';
  import { UseSortDirection } from '@/utils/common';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import dayjs from 'dayjs';
  import _, { get, map, pickBy, find, toLower, cloneDeep } from 'lodash';
  import { reactive, ref, onMounted, nextTick, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { ConnectorRowData, ConnectorTypeData } from '../config/interface';
  import {
    ConnectorCategory,
    actionList,
    connectorTypeList as categoryList
  } from '../config';
  import StatusLabel from './status-label.vue';
  import {
    queryConnectors,
    updateConnector,
    reinstallFinOpsTools,
    syncFinOpsData,
    deleteConnector,
    isProjectContext,
    CONNECTOR_API,
    PROJECT_API_PREFIX
  } from '../api';

  const props = defineProps({
    category: {
      type: String,
      default() {
        return '';
      }
    },
    editPage: {
      type: String,
      default() {
        return '';
      }
    },
    connectorTypeList: {
      type: Array as PropType<ConnectorTypeData[]>,
      default() {
        return categoryList;
      }
    },
    scope: {
      type: String as PropType<'global' | 'project'>,
      default() {
        return 'global';
      }
    }
  });
  const gitType = {
    Github: 'GitHub',
    Gitlab: 'GitLab'
  };

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const axiosSource = useAxiosSource();
  let axiosToken: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, route, t } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);
  const projectID = route.params.projectId as string;
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10,
    category: ''
  });
  const dataList = ref<ConnectorRowData[]>([]);

  const hasPutPermission = computed(() => {
    return projectID
      ? userStore.hasProjectResourceActions({
          resource: Resources.Connectors,
          projectID,
          actions: [Actions.POST]
        })
      : userStore.hasRolesActionsPermission({
          resource: Resources.Connectors,
          actions: [Actions.POST]
        });
  });

  const hasDeletePermission = computed(() => {
    return projectID
      ? userStore.hasProjectResourceActions({
          resource: Resources.Connectors,
          projectID,
          actions: [Actions.DELETE]
        })
      : userStore.hasRolesActionsPermission({
          resource: Resources.Connectors,
          actions: [Actions.DELETE]
        });
  });
  const { updateChunkedList } = useUpdateChunkedList(dataList, {
    filterFun(item) {
      if (props.scope === 'global') {
        return queryParams.category
          ? item.category === queryParams.category && !item.project
          : !item.project;
      }
      return get(item, 'project.id') === route.params?.projectId;
    },
    mapFun(item) {
      if (props.scope === 'project') {
        return {
          ...item,
          disabled: !userStore.hasProjectResourceActions({
            projectID: route.params.projectId,
            connectorID: item.id,
            resource: Resources.Connectors,
            actions: [Actions.DELETE]
          })
        };
      }
      return item;
    }
  });

  const isLocalConnectorType = (category) => {
    return _.find(props.connectorTypeList, (o) => {
      return o.value === category;
    });
  };
  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return item.filterFun
        ? item.filterFun({ itemInfo: row, projectID })
        : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(row)
        : item.disabled;
      if (item.value === 'enableFinops') {
        item.label = row.enableFinOps
          ? 'operation.connectors.table.disableFin'
          : 'operation.connectors.table.enableFin';
      }
      return item;
    });
    return res;
  };

  const rowSelectionState = computed(() => {
    // for project
    if (route.params.projectId) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Connectors,
        projectID: route.params.projectId,
        actions: [Actions.DELETE]
      })
        ? rowSelection
        : null;
    }
    // for global
    return userStore.hasRolesActionsPermission({
      resource: Resources.Connectors,
      actions: [Actions.DELETE]
    })
      ? rowSelection
      : null;
  });
  const getCostStatus = (conditions) => {
    const d = find(conditions, (item) => {
      return item.type === 'CostSynced';
    });
    return d?.message;
  };
  const fetchData = async () => {
    axiosToken?.cancel();
    axiosToken = axiosSource();
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryConnectors(params, axiosToken?.token);
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          disabled:
            props.scope === 'project'
              ? !userStore.hasProjectResourceActions({
                  projectID: route.params.projectId,
                  connectorID: item.id,
                  resource: Resources.Connectors,
                  actions: [Actions.DELETE]
                })
              : false
        };
      });
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
  const handlCreateProjectConnector = (item) => {
    router.push({
      name: item.route,
      params: {
        action: 'edit',
        projectId: route.params.projectId
      }
    });
  };
  const handleCreateGlobalConnector = (item) => {
    router.push({
      name: item.globalRoute,
      params: {
        action: 'edit'
      }
    });
  };
  const handleCreate = (val, item) => {
    if (props.scope === 'project') {
      handlCreateProjectConnector(item);
    } else {
      handleCreateGlobalConnector(item);
    }
  };
  const handleView = (row, action?) => {
    const data = _.find(
      props.connectorTypeList,
      (item) => item.value === row.category
    );
    if (props.scope === 'global') {
      router.push({
        name: data?.globalRoute,
        params: {
          action: action || 'view'
        },
        query: {
          id: row.id
        }
      });
    } else {
      router.push({
        name: data?.route,
        params: {
          projectId: route.params.projectId,
          action: action || 'view'
        },
        query: {
          id: row.id
        }
      });
    }
  };
  const handleCellClick = (row, col) => {
    if (col.dataIndex === 'name' && isLocalConnectorType(row.category)) {
      handleView(row);
    }
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteConnector({ items: ids });
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
    handleView(row, 'edit');
  };
  const handleReinstallConfirm = async (row) => {
    try {
      loading.value = true;
      await reinstallFinOpsTools(row);
      Message.success(t('common.message.success'));
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const handleReinstall = async (row) => {
    deleteModal({
      title: 'operation.connectors.reinstall.tips',
      okText: 'operation.connectors.reinstall.button',
      onOk: () => {
        handleReinstallConfirm(row);
      }
    });
  };
  const handleFetchCost = async (row) => {
    try {
      row.loading = true;
      await syncFinOpsData(row);
      Message.success(t('common.message.success'));
      row.loading = false;
    } catch (error) {
      row.loading = false;
    }
  };
  const handleEnableFinOps = async (enable, data) => {
    try {
      loading.value = true;
      const row = cloneDeep(data);
      row.enableFinOps = enable;
      row.configData = null;
      await updateConnector(row);
      loading.value = false;
      Message.success(t('common.message.success'));
    } catch (error) {
      loading.value = false;
    }
  };
  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };

  const handleClickAction = (value, row) => {
    console.log('value', value, row);
    switch (value) {
      case 'edit':
        handleClickEdit(row);
        break;
      case 'fetch':
        handleFetchCost(row);
        break;
      case 'enableFinops':
        handleEnableFinOps(!row.enableFinOps, row);
        break;
      case 'reinstall':
        handleReinstall(row);
        break;
      case 'delete':
        handleDelete([row.id]);
        break;
      default:
        break;
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createConnectChunkRequest = () => {
    let url = CONNECTOR_API;
    if (isProjectContext()) {
      url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}`;
    }
    try {
      setChunkRequest({
        url: `${url}`,
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
      createConnectChunkRequest();
    });
  };
  const handleReset = () => {
    queryParams.category = '';
    queryParams.query = '';
    queryParams.page = 1;
    handleFilter();
    nextTick(() => {
      createConnectChunkRequest();
    });
  };
  onMounted(() => {
    fetchData();
    nextTick(() => {
      createConnectChunkRequest();
    });
  });
</script>

<style lang="less" scoped>
  .mright-0 {
    :deep(.arco-link-icon) {
      margin-right: 0;
    }
  }
</style>
