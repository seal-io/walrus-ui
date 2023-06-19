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
          data-index="environment.name"
          :title="$t('applications.applications.detail.env')"
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
                text: get(record, 'status.summaryStatus'),
                message: '',
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
          :width="180"
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
    <cloneInstanceModal
      v-model:show="showCloneModal"
      :service-i-d="_.get(cloneInstance, 'id')"
      :title="
        $t('applications.applications.instance.clonetitle', {
          from: _.get(cloneInstance, 'name')
        })
      "
      @save="cloneHandler"
    ></cloneInstanceModal>
    <rollbackModal
      v-model:show="showRollbackModal"
      :service-id="selectedVersion"
      :project-i-d="queryParams.projectID"
      :title="rollbackTitle"
    ></rollbackModal>
    <deleteInstanceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirmModal"
      :title="$t('common.delete.tips')"
    >
    </deleteInstanceModal>
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
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import { execSucceed } from '@/utils/monitor';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { useUserStore } from '@/store';
  import { AppRowData } from '../config/interface';
  import { websocketEventType, serviceActions } from '../config';
  import {
    queryServices,
    deleteService,
    deleteApplicationInstance
  } from '../api';
  import useTemplatesData from '../hooks/use-templates-data';
  import useRollbackRevision from '../hooks/use-rollback-revision';
  import cloneInstanceModal from '../components/clone-instance-modal.vue';
  import deleteInstanceModal from '../components/delete-instance-modal.vue';
  import rollbackModal from '../components/rollback-modal.vue';

  const userStore = useUserStore();
  const {
    completeData,
    initCompleteData,
    serviceDataList,
    templateList,
    allTemplateVersions
  } = useTemplatesData();
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

  const showCloneModal = ref(false);
  const cloneInstance = ref({});
  const showEditModal = ref(false);
  const moduleAction = ref('create');
  const showDeleteModal = ref(false);
  const serviceInfo = ref<any>({});
  const serviceDel = ref<any>({});
  const id = route.query.id as string;
  const delType = ref('');
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);
  const queryParams = reactive({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    query: '',
    page: 1,
    perPage: 10
  });
  const actionHandlerMap = new Map();
  const axiosInstance: any = null;
  const dataList = ref<AppRowData[]>([]);

  const handleResetServiceInfo = () => {
    serviceInfo.value = {};
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
  const handleSelect = () => {};
  const fetchData = async () => {
    if (!queryParams.projectID) return;
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryServices(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      dataList.value = [];
      console.log(error);
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSaveService = () => {
    queryParams.page = 1;
    handleFilter();
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
  const handleClickClone = async (item) => {
    cloneInstance.value = item;
    setTimeout(() => {
      showCloneModal.value = true;
    }, 100);
  };
  const cloneHandler = async () => {
    try {
      cloneInstance.value = {};
      handleSearch();
      execSucceed();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickAction = (value, row) => {
    if (value === 'delete') {
      handleDelete(row, 'row');
      return;
    }
    actionHandlerMap.get(value)(row);
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
    // moduleAction.value = 'create';
    // setTimeout(() => {
    //   showEditModal.value = true;
    // }, 150);
  };
  const handleDeleteConfirm = async (force) => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteService({
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
      console.log(error);
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
  const handleDeleteConfirmRow = async (force) => {
    try {
      await deleteApplicationInstance({ id: serviceDel.value, force });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteConfirmModal = (force) => {
    if (delType.value === 'row') {
      handleDeleteConfirmRow(force);
    } else {
      handleDeleteConfirm(force);
    }
  };
  const handleDelete = async (row, type) => {
    delType.value = type;
    serviceDel.value = row.id;
    setTimeout(() => {
      showDeleteModal.value = true;
    }, 100);
  };
  const setActionHandler = () => {
    actionHandlerMap.set('upgrade', handleClickUpgrade);
    actionHandlerMap.set('clone', handleClickClone);
    actionHandlerMap.set('rollback', handleClickRollback);
  };
  const init = async () => {
    userStore.setInfo({ currentProject: queryParams.projectID });
    fetchData();
  };

  const updateApplicationList = (data) => {
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.project?.id === queryParams.projectID
    );
    const ids = data?.ids || [];
    // CREATE
    if (data?.type === websocketEventType.create) {
      dataList.value = _.concat(collections, dataList.value);
      return;
    }
    // DELETE
    if (data?.type === websocketEventType.delete) {
      dataList.value = _.filter(dataList.value, (item) => {
        return !_.find(ids, (id) => id === item.id);
      });
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
      } else {
        dataList.value = _.concat(_.cloneDeep(item), dataList.value);
      }
    });
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateApplicationList(data);
    });
  };
  const createInstanceListWebsocket = () => {
    try {
      if (!queryParams.projectID) return;
      setChunkRequest({
        url: `/services`,
        params: {
          projectID: queryParams.projectID,
          environmentID: queryParams.environmentID
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };

  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
  });
  onMounted(() => {
    setActionHandler();
    createInstanceListWebsocket();
  });
  init();
</script>

<script lang="ts">
  export default {
    name: 'ApplicationsList'
  };
</script>

<style lang="less" scoped></style>
