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
              resource: Resources.Applications,
              actions: ['POST']
            })
          "
          type="primary"
          @click="handleCreate"
          >{{ $t('applications.applications.create') }}</a-button
        >
        <!-- <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID: queryParams.projectID,
              resource: Resources.Applications,
              actions: ['DELETE']
            })
          "
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        > -->
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
                  resource: Resources.Applications,
                  actions: ['GET']
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
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space>
              <span
                v-for="item in instanceActions"
                :key="item.value"
                :value="item.value"
              >
                <a-tooltip :content="$t(item.label)">
                  <a-link @click="handleClickAction(item, record)">
                    <component
                      :is="item.icon"
                      v-bind="item.props"
                      style="margin-right: 8px"
                    ></component>
                  </a-link>
                </a-tooltip>
              </span>
              <a-tooltip :content="$t('common.button.delete')">
                <a-link status="danger" @click="handleDelete(record)">
                  <icon-delete></icon-delete>
                </a-link>
              </a-tooltip>
              <!-- <a-dropdown-button
                size="small"
                style="line-height: 30px"
                position="bl"
                @select="handleSelect"
              >
                <a-tooltip :content="$t('common.button.edit')">
                  <a-link
                    v-if="
                      userStore.hasProjectResourceActions({
                        projectID: queryParams.projectID,
                        resource: Resources.Applications,
                        actions: ['GET', 'POST']
                      })
                    "
                    @click="handleClickEdit(record)"
                  >
                    <icon-edit></icon-edit>
                  </a-link>
                </a-tooltip>
                <template #icon
                  ><icon-more style="font-size: 18px; stroke-width: 5"
                /></template>
                <template #content>
                  <a-doption
                    v-for="item in instanceActions"
                    :key="item.value"
                    :value="item.value"
                  >
                    <a-tooltip :content="$t(item.label)">
                      <a-link>
                        <component
                          :is="item.icon"
                          v-bind="item.props"
                          style="margin-right: 8px"
                        ></component>
                      </a-link>
                    </a-tooltip>
                  </a-doption>
                </template>
              </a-dropdown-button> -->
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
    <CreateService
      v-model:show="showEditModal"
      v-model:action="moduleAction"
      :data-info="serviceInfo"
      :templates="templateList"
      :modules="serviceDataList"
      :all-module-versions="allTemplateVersions"
      @reset="handleResetServiceInfo"
      @save="handleSaveService"
    ></CreateService>
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
      :instance-id="selectedInstance"
      :project-i-d="queryParams.projectID"
      :title="rollbackTitle"
    ></rollbackModal>
    <deleteInstanceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteInstanceModal>
  </ComCard>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import _, { map, get, pickBy, find, filter } from 'lodash';
  import dayjs from 'dayjs';
  import {
    reactive,
    ref,
    watch,
    onBeforeUnmount,
    provide,
    getCurrentInstance,
    onMounted
  } from 'vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import localStore from '@/utils/localStore';
  import { useUserStore } from '@/store';
  import { queryProjects } from '../../projects/api';
  import { AppRowData } from '../config/interface';
  import {
    statusMap,
    websocketEventType,
    setInstanceStatus,
    instanceActions
  } from '../config';
  import {
    queryApplications,
    deleteApplication,
    deleteApplicationInstance
  } from '../api';
  import InstanceStatus from '../components/instance-status.vue';
  import CreateService from '../components/app-info/edit-module.vue';
  import useTemplatesData from '../hooks/use-templates-data';
  import useRollbackRevision from '../hooks/use-rollback-revision';
  import cloneInstanceModal from '../components/clone-instance-modal.vue';
  import rollbackModal from '../components/rollback-modal.vue';
  import deleteInstanceModal from '../components/delete-instance-modal.vue';

  const HOT_PROJECT_ID = 'HOT_PROJECT_ID';
  const { proxy } = getCurrentInstance();
  const userStore = useUserStore();
  const {
    completeData,
    initCompleteData,
    completeDataSetter,
    serviceDataList,
    templateList,
    allTemplateVersions
  } = useTemplatesData();
  const {
    showRollbackModal,
    rollbackTitle,
    selectedInstance,
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
  const id = route.query.id || '';
  let timer: any = null;
  let loopTimer: any = null;
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

  provide('completeData', completeData);

  const handleResetServiceInfo = () => {
    serviceInfo.value = {};
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
      const { data } = await queryApplications(params);
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
      name: 'ProjectServiceEdit',
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
  const handleClickAction = (item, row) => {
    actionHandlerMap.get(item.value)(row);
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
      name: 'ProjectServiceEdit',
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
  // const handleDeleteConfirm = async () => {
  //   try {
  //     loading.value = true;
  //     const ids = map(selectedKeys.value, (val) => {
  //       return {
  //         id: val
  //       };
  //     });
  //     await deleteApplication({ data: ids, projectID: queryParams.projectID });
  //     loading.value = false;
  //     execSucceed();
  //     queryParams.page = 1;
  //     selectedKeys.value = [];
  //     rowSelection.selectedRowKeys = [];
  //     handleFilter();
  //   } catch (error) {
  //     console.log(error);
  //     loading.value = false;
  //   }
  // };

  const handleClickViewDetail = (row) => {
    router.push({
      name: 'ProjectServiceDetail',
      params: {
        ...route.params
      },
      query: {
        id: row.id
      }
    });
  };
  const handleDeleteConfirm = async (force) => {
    try {
      await deleteApplicationInstance({ id: serviceDel.value, force });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (row) => {
    serviceDel.value = row.id;
    setTimeout(() => {
      showDeleteModal.value = true;
    }, 100);
  };
  const setActionHandler = () => {
    _.each(instanceActions, (item) => {
      actionHandlerMap.set(item.value, _.get(proxy, item.handler));
    });
  };
  const init = async () => {
    initCompleteData();
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
    // const collections = data?.collection || [];
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
      // if (axiosInstance || !queryParams.projectID) return;
      if (!queryParams.projectID) return;
      setChunkRequest({
        url: `/services`,
        params: {
          projectID: queryParams.projectID
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };
  const loopUpdateCall = async () => {
    try {
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryApplications(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      dataList.value = [];
      console.log(error);
    }
  };
  const loopUpdateList = () => {
    clearInterval(loopTimer);
    if (!queryParams.projectID) return;
    loopTimer = setInterval(() => {
      loopUpdateCall();
    }, 15 * 1000);
  };
  watch(
    () => queryParams,
    () => {
      // loopUpdateList();
    },
    {
      immediate: true,
      deep: true
    }
  );

  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
    clearInterval(loopTimer);
  });
  onMounted(() => {
    setActionHandler();
    createInstanceListWebsocket();
  });
  // const res = dayjs('2020-02-01').diff('2021-02-01', 'day');
  // console.log('res===', res);
  init();
</script>

<script lang="ts">
  export default {
    name: 'ApplicationsList'
  };
</script>

<style lang="less" scoped>
  .applications-list {
  }
</style>
