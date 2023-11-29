<template>
  <ComCard padding="0" class="applications-list">
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :pagination="false"
      row-key="id"
      :row-selection="
        userStore.isReadOnlyEnvironment(projectID, environmentID)
          ? null
          : rowSelection
      "
      @sorter-change="handleSortChange"
      @selection-change="handleRowSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('common.table.name')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasProjectResourceActions({
                  projectID,
                  resource: Resources.Services,
                  actions: [Actions.GET]
                })
              "
              @click.stop="handleClickViewDetail(record)"
              >{{ record.name }}</a-link
            >
            <span v-else>{{ record.name }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="ServiceDataType.service === type"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="template.name"
          :title="$t('applications.applications.table.module')"
        >
          <template #cell="{ record }">
            <span>
              <span>{{
                `${record.template?.name}@${record.template?.version || ''}`
              }}</span>
              <span
                v-if="!record.template.project?.id"
                style="color: var(--color-text-3)"
                class="font-12 m-l-2"
                >{{ `(${$t('applications.variable.scope.global')})` }}</span
              >
            </span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="ServiceDataType.resource === type"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="$t('common.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          :cell-style="{ minWidth: '40px' }"
          data-index="status"
          :title="$t('applications.applications.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :zoom="0.9"
              :status="{
                status: get(record, 'status.summaryStatus'),
                inactive: _.includes(
                  StartableStatus,
                  get(record, 'status.summaryStatus')
                ),
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
          align="center"
          :width="210"
          data-index="actions"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record, rowIndex }">
            <DropButtonGroup
              v-if="setActionList(dataList[rowIndex]).length"
              :layout="
                setActionList(dataList[rowIndex]).length === 1
                  ? 'horizontal'
                  : 'vertical'
              "
              :actions="setActionList(dataList[rowIndex])"
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
    <rollbackModal
      v-model:show="showRollbackModal"
      :service-id="selectedVersion"
      :project-i-d="projectID"
      :title="rollbackTitle"
    ></rollbackModal>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
    <revisionDetail
      v-model:show="showDetailModal"
      :data-info="revisionData"
      :revision-id="revisionDetailId"
      :initial-status="initialStatus"
    ></revisionDetail>
    <driftResource
      v-model:show="showDriftModal"
      :title="$t('applications.service.resource.drift')"
      :data-list="driftResourceList"
      :active="activeDriftResource"
    >
    </driftResource>
  </ComCard>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import _, { get, pickBy, filter } from 'lodash';
  import dayjs from 'dayjs';
  import {
    reactive,
    ref,
    onBeforeUnmount,
    onMounted,
    nextTick,
    provide,
    watch
  } from 'vue';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import { websocketEventType, PageAction } from '@/views/config';
  import useCallCommon from '@/hooks/use-call-common';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import { useUserStore, useAppStore } from '@/store';
  import { ServiceRowData, DriftDataItem } from '../config/interface';
  import {
    serviceActions,
    serviceActionMap,
    CreatActions,
    ServiceDataType,
    StartableStatus,
    ProvideServiceInfoKey
  } from '../config';
  import {
    queryServices,
    deleteServices,
    refreshServiceConfig,
    SERVICE_API,
    SERVICE_API_PREFIX,
    startApplicationInstance,
    stopApplicationInstance
  } from '../api';
  import useViewLatestLogs from '../hooks/use-view-latest-logs';
  import useRollbackRevision from '../hooks/use-rollback-revision';
  import deleteServiceModal from './delete-service-modal.vue';
  import rollbackModal from './rollback-modal.vue';
  import revisionDetail from './revision-detail.vue';
  import driftResource from './drift-resource.vue';

  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    requestParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    type: {
      type: String,
      default() {
        return 'service';
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  const emits = defineEmits(['selectionChange', 'deleted']);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const {
    showRollbackModal,
    rollbackTitle,
    selectedVersion,
    handleRollbackRevision
  } = useRollbackRevision();
  const { setChunkRequest } = useSetChunkRequest();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, locale, route, t } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const {
    revisionDetailId,
    revisionData,
    showDetailModal,
    initialStatus,
    currentServiceInfo,
    handleViewServiceLatestLogs
  } = useViewLatestLogs();

  // logs
  provide(ProvideServiceInfoKey, currentServiceInfo);

  let fetchToken: any = null;
  const showDeleteModal = ref(false);
  const showDriftModal = ref(false);
  const driftResourceList = ref<DriftDataItem[]>([]);
  const activeDriftResource = ref('');
  const id = route.query.id as string;
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);
  const totalPage = ref(1);
  const { environmentId: environmentID, projectId: projectID } =
    route.params as {
      environmentId: string;
      projectId: string;
    };
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });
  const actionHandlerMap = new Map();
  const axiosInstance: any = null;
  const dataList = ref<ServiceRowData[]>([]);

  const handleRowSelectChange = (list) => {
    handleSelectChange(list);
    emits('selectionChange', list);
  };
  const setActionList = (row) => {
    const list = _.filter(serviceActions, (item) => {
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
  const handleClickDriftResource = (row) => {
    driftResourceList.value =
      _.get(row, 'driftResult.drift.resource_drift') || [];
    const item = _.head(driftResourceList.value);
    activeDriftResource.value = `${item?.type}/${item?.name}`;
    setTimeout(() => {
      showDriftModal.value = true;
    }, 100);
  };
  const fetchData = async () => {
    if (!projectID || !environmentID) return;
    fetchToken?.cancel?.();
    fetchToken = createAxiosToken();
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        isService: props.type === 'service',
        sort: [sort.value]
      };
      const { data } = await queryServices(params, fetchToken?.token);
      dataList.value = _.map(data.items || [], (item) => {
        return {
          ...item,
          disabled: !userStore.hasProjectResourceActions({
            projectID,
            environmentID,
            resource: Resources.Services,
            actions: [Actions.DELETE]
          })
        };
      });
      total.value = data?.pagination?.total || 0;
      totalPage.value = data?.pagination.totalPage || 1;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      dataList.value = [];
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
  const handleClickRollback = (row) => {
    handleRollbackRevision(row);
  };
  const handleClickUpgrade = (row) => {
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        ...route.params,
        dataType: ServiceDataType[props.type],
        action: PageAction.EDIT
      },
      query: {
        id: row.id
      }
    });
  };

  const handleStopResource = async (row) => {
    try {
      await stopApplicationInstance(row);
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleStartResource = async (row) => {
    try {
      await startApplicationInstance(row);
      execSucceed();
    } catch (error) {
      // ignore
    }
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
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        projectId: projectID,
        environmentId: environmentID,
        action: PageAction.EDIT
      }
    });
  };
  const handleSelectAction = (val) => {
    if (val === 'create') {
      handleCreate();
    }
  };
  const handleCloneService = () => {
    router.push({
      name: PROJECT.ServiceClone,
      query: {
        source: selectedKeys.value
      }
    });
  };

  const clearStatus = () => {
    rowSelection.selectedRowKeys = [];
    selectedKeys.value = [];
  };
  const handleDeleteConfirm = async (withoutCleanup) => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
        return { id: val as string };
      });
      await deleteServices({
        data: { items: ids },
        withoutCleanup
      });
      loading.value = false;
      execSucceed();
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      emits('deleted', ids);
    } catch (error) {
      loading.value = false;
    }
  };

  const handleClickViewDetail = (row) => {
    router.push({
      name: PROJECT.ServiceDetail,
      params: {
        ...route.params,
        dataType: ServiceDataType[props.type]
      },
      query: {
        id: row.id
      }
    });
  };

  const handleDelete = (row) => {
    selectedKeys.value = [row.id];
    setTimeout(() => {
      showDeleteModal.value = true;
    }, 100);
  };
  const handleRefreshServiceConfig = async (row) => {
    try {
      loading.value = true;
      await refreshServiceConfig({
        serviceID: row.id
      });
      loading.value = false;
      execSucceed();
    } catch (error) {
      loading.value = false;
    }
  };

  const handleStopModal = async (row) => {
    deleteModal({
      content: 'applications.service.stop.confirm',
      title: t('applications.service.stop.tips', {
        type:
          props.type === ServiceDataType.service
            ? t('applications.applications.service.title')
            : t('applications.applications.resource.title')
      }),
      okText: 'common.button.stop',
      onOk: () => handleStopResource(row)
    });
  };
  const handleClickAction = (value, row) => {
    actionHandlerMap.get(value)(row);
  };

  const setActionHandler = () => {
    actionHandlerMap.set(serviceActionMap.upgrade, handleClickUpgrade);
    actionHandlerMap.set(serviceActionMap.rollback, handleClickRollback);
    actionHandlerMap.set(serviceActionMap.sync, handleRefreshServiceConfig);
    actionHandlerMap.set(serviceActionMap.logs, handleViewServiceLatestLogs);
    actionHandlerMap.set(serviceActionMap.stop, handleStopModal);
    actionHandlerMap.set(serviceActionMap.start, handleStartResource);
    actionHandlerMap.set(serviceActionMap.delete, handleDelete);
  };
  const init = async () => {
    userStore.setInfo({ currentProject: projectID });
    fetchData();
  };

  const updateServiceList = (data) => {
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.project?.id === projectID
    );
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      const createList = _.map(collections, (o) => {
        return {
          ...o,
          disabled: !userStore.hasProjectResourceActions({
            projectID,
            environmentID,
            resource: Resources.Services,
            actions: [Actions.DELETE]
          })
        };
      });
      dataList.value = _.concat(createList, dataList.value);
      dataList.value = _.slice(dataList.value, 0, queryParams.perPage);
      return;
    }
    // DELETE
    if (data?.type === websocketEventType.DELETE) {
      dataList.value = _.filter(dataList.value, (item) => {
        return !_.find(ids, (id) => id === item.id);
      });
      if (queryParams.page > totalPage.value) {
        queryParams.page = 1;
        fetchData();
      } else {
        fetchData();
      }
      return;
    }

    // UPDATE
    _.each(collections, (item) => {
      const updateIndex = _.findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      }
    });
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateServiceList(data);
    });
  };
  const createServiceChunkRequest = () => {
    try {
      if (!projectID) return;
      setChunkRequest({
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}`,
        params: {
          extract: ['-attributes', '-description'],
          isService: props.type === ServiceDataType.service
        },
        handler: updateHandler,
        beforeReconnect: fetchData
      });
    } catch (error) {
      // ignore
    }
  };
  watch(
    () => props.requestParams,
    () => {
      _.assign(queryParams, props.requestParams);
    },
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => props.loading,
    (val) => {
      loading.value = val;
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
  });
  onMounted(() => {
    setActionHandler();
    nextTick(() => {
      createServiceChunkRequest();
    });
  });
  defineExpose({
    fetchData,
    handleFilter,
    handleSearch,
    handleReset,
    clearStatus
  });
  init();
</script>

<style lang="less" scoped></style>
