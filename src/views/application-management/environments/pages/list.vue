<template>
  <ComCard borderless padding="0">
    <div>
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #params>
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
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                projectID,
                resource: Resources.Environments,
                actions: [Actions.POST]
              })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('operation.environments.create') }}</a-button
          >
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
        :row-selection="hasDeletePermission ? rowSelection : null"
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
                type: $t('operation.environments.table.env')
              })
            "
            :body-cell-class="
              (record) => {
                return record.connectors?.length ? 'clickable' : '';
              }
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
                v-if="record.connectors?.length"
                type="text"
                size="small"
                :hoverable="false"
              >
                {{ record.name }}
              </a-link>
              <span
                v-else
                style="display: flex; align-items: center"
                class="mleft-5"
              >
                <span>{{ record.name }}</span>
                <a-tooltip :content="$t('applications.instance.env.tips')">
                  <icon-exclamation-circle-fill
                    class="mleft-5"
                    style="color: var(--color-text-2)"
                  />
                </a-tooltip>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            align="left"
            data-index="type"
            :title="$t('applications.environment.table.status')"
          >
            <template #cell="{ record }">
              <serviceSummary
                :data-list="genSummaryData(record)"
              ></serviceSummary>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="left"
            data-index="type"
            :title="$t('applications.environment.type')"
          >
            <template #cell="{ record }">
              <span>{{ $t(EnvironmentTypeMap[record.type] || '') }}</span>
            </template>
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
          <result-view
            :loading="loading"
            :title="
              queryParams.query
                ? $t('project.environment.result.nodata.title')
                : $t('project.environment.result.title')
            "
            :subtitle="
              queryParams.query
                ? $t('project.environment.result.nodata.subtitle')
                : $t('project.environment.result.subTitle')
            "
          >
            <template #icon>
              <icon-find-replace v-if="queryParams.query" />
              <i v-else class="iconfont icon-server"></i>
            </template>
            <template #extra>
              <a-button
                v-if="
                  userStore.hasProjectResourceActions({
                    projectID,
                    resource: Resources.Environments,
                    actions: [Actions.POST]
                  }) && !queryParams.query
                "
                type="outline"
                @click="handleCreate"
                ><icon-plus class="m-r-4" />{{
                  $t('common.button.create.now')
                }}</a-button
              >
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
    <CreateEnvironment
      v-model:show="showModal"
      v-model:info="currentInfo"
      :action="action"
      @save="handleSearch"
    ></CreateEnvironment>
  </ComCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import _, { map, pickBy } from 'lodash';
  import {
    PageAction,
    EnvironmentTypeMap,
    CommonButtonValue
  } from '@/views/config';
  import { PROJECT } from '@/router/config';
  import { useUserStore, useAppStore, useProjectStore } from '@/store';
  import { Resources, Actions } from '@/permissions/config';
  import { ref, reactive, onMounted, nextTick, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import { EnvironmentRow } from '../config/interface';
  import {
    queryEnvironments,
    deleteEnvironment,
    stopEnvironment,
    startEnvironment,
    ENVIRONMENT_API,
    PROJECT_API_PREFIX
  } from '../api';
  import CreateEnvironment from '../components/create-environment.vue';
  import serviceSummary from '../components/service-summary.vue';
  import { EnvironmentActions } from '../config';

  const orderMap = {
    ready: 1,
    transitioning: 2,
    error: 3,
    warning: 4,
    inactive: 5
  };
  let timer: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  const { setChunkRequest } = useSetChunkRequest();

  const appStore = useAppStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const { router, route } = useCallCommon();
  const loading = ref(false);
  const dataList = ref<EnvironmentRow[]>([]);
  const total = ref(0);
  const showModal = ref(false);
  const currentInfo = ref({});
  const actionHandlerMap = new Map();
  const action = ref(PageAction.EDIT);
  const projectID = route.params.projectId as string;
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });

  const { updateChunkedList } = useUpdateChunkedList(dataList);

  const hasDeletePermission = computed(() => {
    return userStore.hasProjectResourceActions({
      projectID,
      resource: Resources.Environments,
      actions: [Actions.DELETE]
    });
  });
  const genSummaryData = (row) => {
    return _.map(_.keys(row.statusSummary), (key) => {
      return {
        value: row.statusSummary[key] || 0,
        status: key,
        label: _.capitalize(key),
        order: orderMap[key]
      };
    })
      .sort((a, b) => {
        return a.order - b.order;
      })
      .filter((item) => item.status !== 'warning');
  };
  const handleCreate = () => {
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        projectId: route.params.projectId,
        action: PageAction.EDIT
      }
    });
  };

  const setActionList = (row) => {
    const list = _.filter(EnvironmentActions, (item) => {
      return item.filterFun ? item.filterFun({ row, projectID }) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.({ row, projectID })
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
      const { data } = await queryEnvironments(params);
      dataList.value = _.map(data.items || [], (item) => {
        return {
          ...item,
          disabled: !userStore.hasProjectResourceActions({
            projectID,
            environmentID: item.id,
            resource: Resources.Environments,
            actions: [Actions.DELETE]
          })
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    fetchData();
  };

  const handleView = (row) => {
    router.push({
      name: PROJECT.EnvDetail,
      params: {
        ...route.params,
        environmentId: row.id,
        action: PageAction.VIEW
      },
      query: {
        id: row.id
      }
    });
  };
  const handleEdit = (row) => {
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        action: PageAction.EDIT
      },
      query: { id: row.id }
    });
  };
  const handleViewDetail = (row) => {
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        action: PageAction.VIEW
      },
      query: { id: row.id }
    });
  };
  const handleCellClick = (row, col) => {
    if (col.dataIndex === 'name' && row.connectors?.length) {
      handleView(row);
    }
  };
  const handleClone = (row) => {
    router.push({
      name: PROJECT.EnvClone,
      params: {
        environmentId: row.id,
        clone: 'clone'
      },
      query: {
        id: row.id
      }
    });
  };
  const handleStopEnvironment = async (row) => {
    try {
      await stopEnvironment({ id: row.id });
      execSucceed();
    } catch (error) {
      // ingore
    }
  };
  const handleStartEnvironment = async (row) => {
    try {
      await startEnvironment({ id: row.id });
      execSucceed();
    } catch (error) {
      // ingore
    }
  };
  const handleClickAction = (value, row) => {
    actionHandlerMap.get(value)(row);
  };

  const removeDefaultActiveEnvironment = (ids: Array<{ id: string }>) => {
    const { defaultActiveEnvironment } = projectStore;
    if (!defaultActiveEnvironment) return;
    const index = _.findIndex(ids, (item) => {
      return item.id === defaultActiveEnvironment?.id;
    });
    if (index > -1) {
      projectStore.setDefaultActiveEnvironment(null);
      projectStore.setIsDefaultActiveEnvironment(false);
    }
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val as string
        };
      });
      await deleteEnvironment({ items: ids });
      loading.value = false;
      execSucceed();
      removeDefaultActiveEnvironment(ids);
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      loading.value = false;
    }
  };
  const handleDelete = async (row?: any) => {
    const ids: any = row ? [row.id] : null;
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };
  const handleStopModal = async (row) => {
    deleteModal({
      content: 'applications.service.stop.confirm',
      title: 'applications.service.stop.env',
      okText: 'common.button.stop',
      onOk: () => handleStopEnvironment(row)
    });
  };
  const setActionHandler = () => {
    actionHandlerMap.set(CommonButtonValue.Edit, handleEdit);
    actionHandlerMap.set(CommonButtonValue.View, handleViewDetail);
    actionHandlerMap.set(CommonButtonValue.Clone, handleClone);
    actionHandlerMap.set(CommonButtonValue.Stop, handleStopModal);
    actionHandlerMap.set(CommonButtonValue.Start, handleStartEnvironment);
    actionHandlerMap.set(CommonButtonValue.Delete, handleDelete);
  };

  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createEnvironmentChunkRequest = () => {
    const url = `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}`;
    try {
      setChunkRequest({
        url,
        params: {
          ..._.pickBy(queryParams, (val) => !!val)
        },
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };
  onMounted(() => {
    setActionHandler();
    nextTick(() => {
      createEnvironmentChunkRequest();
    });
  });
  fetchData();
</script>

<style lang="less" scoped></style>
