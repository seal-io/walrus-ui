<template>
  <ComCard padding="0" class="applications-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 220px"
          :placeholder="$t('applications.applications.table.holder')"
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
          v-if="
            userStore.hasProjectResourceActions({
              projectID: queryParams.projectID,
              resource: Resources.Services,
              actions: [Actions.POST]
            })
          "
          type="primary"
          @click="handleCreate"
          >{{ $t('applications.applications.create') }}</a-button
        >
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID: queryParams.projectID,
              resource: Resources.Services,
              actions: [Actions.POST]
            })
          "
          status="success"
          type="primary"
          :disabled="!selectedKeys.length"
          @click="handleCloneService"
          >{{ $t('applications.service.clone') }}</a-button
        >
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID: queryParams.projectID,
              resource: Resources.Services,
              actions: [Actions.DELETE]
            })
          "
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete({}, 'button')"
          >{{ $t('common.button.delete') }}</a-button
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
          :title="$t('applications.applications.table.service')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasProjectResourceActions({
                  projectID: queryParams.projectID,
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
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="template.id"
          :title="$t('applications.applications.table.module')"
        >
          <template #cell="{ record }">
            <span>{{
              getListLabel(record.template?.id, templateList, {
                label: 'name',
                value: 'id'
              })
            }}</span>
          </template>
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
          :cell-style="{ minWidth: '40px' }"
          data-index="driftResult.drifted"
          :title="$t('applications.service.resource.drift')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="record?.driftResult?.drifted"
              @click="handleClickDriftResource(record)"
              >{{ $t('common.button.view') }}</a-link
            >
            <span v-else>-</span>
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
              :actions="setActionList(dataList[rowIndex])"
              @click="(val) => handleClickUpgrade(record)"
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
      :hide-on-single-page="queryParams.perPage === 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
    <rollbackModal
      v-model:show="showRollbackModal"
      :service-id="selectedVersion"
      :project-i-d="queryParams.projectID"
      :title="rollbackTitle"
    ></rollbackModal>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
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
    watch,
    onBeforeUnmount,
    provide,
    onMounted
  } from 'vue';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import { execSucceed } from '@/utils/monitor';
  import { getListLabel } from '@/utils/func';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { useUserStore } from '@/store';
  import { ServiceRowData, DriftDataItem } from '../config/interface';
  import { websocketEventType, serviceActions } from '../config';
  import { queryServices, deleteServices, refreshServiceConfig } from '../api';
  import useRollbackRevision from '../hooks/use-rollback-revision';
  import useCompleteData from '../hooks/use-complete-data';
  import deleteServiceModal from '../components/delete-service-modal.vue';
  import rollbackModal from '../components/rollback-modal.vue';
  import driftResource from '../components/drift-resource.vue';

  const userStore = useUserStore();
  const { templateList, getTemplates } = useCompleteData();
  const {
    showRollbackModal,
    rollbackTitle,
    selectedVersion,
    handleRollbackRevision
  } = useRollbackRevision();
  const { setChunkRequest } = useSetChunkRequest();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, locale, route } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });

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
  const queryParams = reactive({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    query: '',
    page: 1,
    perPage: 10
  });
  const actionHandlerMap = new Map();
  const axiosInstance: any = null;
  const dataList = ref<ServiceRowData[]>([]);

  const setActionList = (row) => {
    const list = _.filter(serviceActions, (item) => {
      if (item.value === 'delete') return false;
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
    const item = _.head(driftResourceList.value) || {};
    activeDriftResource.value = `${item.type}/${item.name}`;
    setTimeout(() => {
      showDriftModal.value = true;
    }, 100);
  };
  const fetchData = async () => {
    if (!queryParams.projectID || !queryParams.environmentID) return;
    fetchToken?.cancel?.();
    fetchToken = createAxiosToken();
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryServices(params, fetchToken?.token);
      dataList.value = data?.items || [];
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
    handleRollbackRevision('instance', row);
  };
  const handleClickUpgrade = (row) => {
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        action: 'edit'
      },
      query: {
        id: row.id
      }
    });
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
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        projectId: queryParams.projectID,
        environmentId: queryParams.environmentID,
        action: 'edit'
      }
    });
  };
  const handleCloneService = () => {
    router.push({
      name: PROJECT.ServiceClone,
      query: {
        source: selectedKeys.value
      }
    });
  };
  const handleDeleteConfirm = async (force) => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
        return val;
      });
      await deleteServices({
        data: ids,
        projectID: queryParams.projectID,
        force
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

  const handleClickViewDetail = (row) => {
    router.push({
      name: PROJECT.ServiceDetail,
      params: {
        ...route.params
      },
      query: {
        id: row.id
      }
    });
  };

  const handleDelete = async (row, type) => {
    showDeleteModal.value = true;
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
  const handleClickAction = (value, row) => {
    actionHandlerMap.get(value)(row);
  };
  const setActionHandler = () => {
    actionHandlerMap.set('upgrade', handleClickUpgrade);
    actionHandlerMap.set('rollback', handleClickRollback);
    actionHandlerMap.set('sync', handleRefreshServiceConfig);
  };
  const init = async () => {
    userStore.setInfo({ currentProject: queryParams.projectID });
    fetchData();
    getTemplates();
  };

  const updateApplicationList = (data) => {
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.project?.id === queryParams.projectID
    );
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.CREATE) {
      dataList.value = _.concat(collections, dataList.value);
      dataList.value = _.slice(dataList.value, 0, 10);
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
      updateApplicationList(data);
    });
  };
  const createServiceChunkRequest = () => {
    try {
      if (!queryParams.projectID) return;
      setChunkRequest({
        url: `/services`,
        params: {
          projectID: queryParams.projectID,
          environmentID: queryParams.environmentID
        },
        handler: updateHandler,
        beforeReconnect: fetchData
      });
    } catch (error) {
      //
    }
  };

  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
  });
  onMounted(() => {
    setActionHandler();
    createServiceChunkRequest();
  });
  init();
</script>

<style lang="less" scoped></style>
