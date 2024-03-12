<template>
  <div>
    <SpinCard borderless class="projects" padding="0">
      <div class="content">
        <FilterBox style="margin-bottom: var(--filter-box-margin)">
          <template #params>
            <a-input
              v-model.trim="queryParams.query"
              allow-clear
              style="width: 240px"
              :placeholder="$t('common.search.name.placeholder')"
              @clear="handleSearchByQuery"
              @press-enter="handleSearchByQuery"
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
              status="success"
              type="primary"
              :disabled="!selectedKeys.length"
              @click="handleBatchDeployment"
              >{{ $t('applications.service.batchDeploy')
              }}<span v-if="selectedKeys.length">{{
                `(${selectedKeys.length})`
              }}</span></a-button
            >
            <a-button
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
          :row-selection="rowSelection"
          @cell-click="handleCellClick"
          @selection-change="handleSelectChange"
          @sorter-change="handleSortChange"
        >
          <template #columns>
            <a-table-column
              ellipsis
              tooltip
              :body-cell-class="
                (record) =>
                  userStore.hasProjectResourceActions({
                    projectID: record.project?.id,
                    environmentID: record.environment?.id,
                    resource: Resources.Projects,
                    actions: [Actions.GET]
                  })
                    ? 'clickable'
                    : ''
              "
              :cell-style="{ minWidth: '40px' }"
              data-index="name"
              :title="$t('common.table.name')"
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
                    userStore.hasProjectResourceActions({
                      projectID: record.project?.id,
                      environmentID: record.environment?.id,
                      resource: Resources.Projects,
                      actions: [Actions.GET]
                    })
                  "
                  :hoverable="false"
                  size="small"
                  >{{ record.name }}</a-link
                >
                <span v-else>{{ record.name }}</span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="project.name"
              :title="$t('applications.projects.table.name')"
            >
              <template #title>
                <a-select
                  v-model="queryParams.projectName"
                  :options="projectList"
                  style="
                    min-width: 150px;
                    max-width: 180px;
                    background-color: var(--color-white-2);
                  "
                  :placeholder="$t('applications.projects.table.name')"
                  allow-clear
                  allow-search
                  @change="handleSearchByTabelField"
                ></a-select>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="environment.name"
              :title="$t('operation.environments.table.env')"
            >
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="resourceDefinitionMatchingRule.name"
              :title="$t('resource.definition.detail.matchRule')"
            >
              <template #title>
                <a-select
                  v-model="queryParams.matchingRuleName"
                  style="
                    min-width: 150px;
                    max-width: 180px;
                    background-color: var(--color-white-2);
                  "
                  allow-clear
                  allow-search
                  :placeholder="$t('resource.definition.detail.matchRule')"
                  @change="handleSearchByTabelField"
                >
                  <a-option
                    v-for="(item, index) in matchRules"
                    :key="index"
                    :value="item.name"
                  >
                    <AutoTip>
                      {{ item.name }}
                    </AutoTip>
                  </a-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="status.summaryStatus"
              :title="$t('common.table.status')"
            >
              <template #cell="{ record }">
                <StatusLabel
                  :zoom="0.9"
                  :status="_.get(record, 'status', {})"
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
                    setActionList(record).length === 1
                      ? 'horizontal'
                      : 'vertical'
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
    </SpinCard>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
    <CommentModal
      v-model:show="showCommentModal"
      :title="$t('applications.service.batchDeploy')"
      @confirm="handleComfirmComment"
    ></CommentModal>
  </div>
</template>

<script lang="ts" setup>
  import i18n from '@/locale';
  import {
    useSetChunkRequest,
    createAxiosToken
  } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { PROJECT } from '@/router/config';
  import CommentModal from '@/views/commons/components/comment-modal/index.vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { Resources, Actions } from '@/permissions/config';
  import _, { pickBy } from 'lodash';
  import { ref, reactive, PropType, computed, nextTick, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { useUserStore, useProjectStore, useAppStore } from '@/store';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import {
    definitionResourceActions,
    serviceActionMap
  } from '@/views/application-management/services/config';
  import {
    deleteServices,
    stopApplicationInstance,
    startApplicationInstance
  } from '@/views/application-management/services/api';
  import deleteServiceModal from '@/views/application-management/services/components/delete-service-modal.vue';
  import {
    queryItemDefinitionResources,
    batchDeployDefinitionResources,
    batchDeleteDefinitionResource,
    batchDeployService,
    RESOURCE_DEFINITION_API
  } from '../api';

  const props = defineProps({
    projectList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    matchRules: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });

  const { setChunkRequest } = useSetChunkRequest();
  let timer: any = null;
  const currentResource = ref<any>({});
  const isBatchDelete = ref(false);
  const isBatchDeploy = ref(false);
  const showCommentModal = ref(false);
  const delItem = ref<any>({});
  const actionHandlerMap = new Map();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const { t, route, router } = useCallCommon();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );

  const showDeleteModal = ref(false);
  const loading = ref(false);
  const dataList = ref<any[]>([]);
  const total = ref(0);
  const queryParams = reactive({
    query: '',
    matchingRuleName: '',
    projectName: '',
    page: 1,
    perPage: appStore.perPage || 10
  });

  const { updateChunkedList } = useUpdateChunkedList(dataList, {
    mapFun: (item) => {
      return {
        ...item,
        disabled: !userStore.hasProjectResourceActions({
          projectID: item.project?.id,
          environmentID: item.environment?.id,
          resource: Resources.Resources,
          actions: [Actions.DELETE]
        })
      };
    }
  });

  const setActionList = (row) => {
    const list = _.filter(definitionResourceActions, (item) => {
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

  const handleViewResource = async (row) => {
    router.push({
      name: PROJECT.ServiceDetail,
      params: {
        projectId: row.project.id,
        environmentId: row.environment.id,
        dataType: 'resource'
      },
      query: { id: row.id, from: 'definition' }
    });
  };
  const handleCellClick = (row, col) => {
    if (
      col.dataIndex === 'name' &&
      userStore.hasProjectResourceActions({
        projectID: row.project?.id,
        environmentID: row.environment?.id,
        resource: Resources.Resources,
        actions: [Actions.GET]
      })
    ) {
      handleViewResource(row);
    }
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryItemDefinitionResources({
        id: route.query.id as string,
        pageParams: params
      });
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          disabled: !userStore.hasProjectResourceActions({
            projectID: item.project?.id,
            environmentID: item.environment?.id,
            resource: Resources.Resources,
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

  const handleSortChange = (dataIndex: string, direction: string) => {
    console.log(dataIndex, direction);
    setSortDirection(dataIndex, direction);
    fetchData();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
    nextTick(() => {
      createResourcesChunkRequest();
    });
  };
  const handleSearchByQuery = () => {
    queryParams.page = 1;
    handleFilter();
  };
  const handleSearchByTabelField = () => {
    queryParams.page = 1;
    handleFilter();
  };
  const handleReset = () => {
    queryParams.query = '';
    queryParams.matchingRuleName = '';
    queryParams.projectName = '';
    queryParams.page = 1;
    handleFilter();
    nextTick(() => {
      createResourcesChunkRequest();
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
  const handleBatchDeployment = () => {
    isBatchDeploy.value = true;
    setTimeout(() => {
      showCommentModal.value = true;
    }, 100);
  };

  const handleDeployItemCall = async (comment) => {
    try {
      await batchDeployService({
        items: [{ id: currentResource.value.id }],
        reuseAttributes: true,
        projectID: currentResource.value.project?.id,
        environmentID: currentResource.value.environment?.id,
        changeComment: comment
      });
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleComfirmComment = async (val) => {
    try {
      if (isBatchDeploy.value) {
        await batchDeployDefinitionResources({
          id: route.query.id as string,
          changeComment: val,
          items: _.map(selectedKeys.value, (val) => {
            return { id: val as string };
          }),
          reuseAttributes: true
        });
        execSucceed();
      } else {
        await handleDeployItemCall(val);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleDeployItemService = async (row) => {
    currentResource.value = row;
    isBatchDeploy.value = false;
    setTimeout(() => {
      showCommentModal.value = true;
    }, 100);
  };
  const handleDeleteConfirm = async (withoutCleanup) => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
        return { id: val as string };
      });
      if (isBatchDelete.value) {
        await batchDeleteDefinitionResource({
          id: route.query.id as string,
          withoutCleanup,
          data: { items: ids }
        });
      } else {
        await deleteServices({
          data: { items: ids },
          withoutCleanup,
          withParams: true,
          projectID: delItem.value.project?.id,
          environmentID: delItem.value.environment?.id
        });
      }

      loading.value = false;
      execSucceed();
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      loading.value = false;
    }
  };

  const handleDelete = (row?) => {
    if (row) {
      selectedKeys.value = [row.id];
      delItem.value = row;
      isBatchDelete.value = false;
    } else {
      isBatchDelete.value = true;
    }
    setTimeout(() => {
      showDeleteModal.value = true;
    }, 100);
  };

  const handleClickAction = async (value, row) => {
    await actionHandlerMap.get(value)(row);
  };
  const handleStopResource = async (row) => {
    try {
      await stopApplicationInstance(
        {
          projectID: row.project.id,
          environmentID: row.environment.id,
          serviceID: row.id
        },
        true
      );
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleStartResource = async (row) => {
    try {
      await startApplicationInstance(
        {
          projectID: row.project.id,
          environmentID: row.environment.id,
          serviceID: row.id
        },
        true
      );
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleStopModal = async (row) => {
    deleteModal({
      content: 'applications.service.stop.confirm',
      title: t('applications.service.stop.tips', {
        type: t('applications.applications.resource.title')
      }),
      okText: 'common.button.stop',
      onOk: () => handleStopResource(row)
    });
  };
  const setActionHandler = () => {
    actionHandlerMap.set(serviceActionMap.stop, handleStopModal);
    actionHandlerMap.set(serviceActionMap.start, handleStartResource);
    actionHandlerMap.set(serviceActionMap.deploy, handleDeployItemService);
    actionHandlerMap.set(serviceActionMap.delete, handleDelete);
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
  const createResourcesChunkRequest = () => {
    try {
      if (!route.query.id) return;
      setChunkRequest({
        url: `${RESOURCE_DEFINITION_API}/${route.query.id}/resources`,
        params: {
          ..._.pickBy(_.omit(queryParams, ['page', 'perPage']), (val) => !!val)
        },
        handler: updateHandler,
        beforeReconnect: fetchData
      });
    } catch (error) {
      // ignore
    }
  };
  const init = () => {
    fetchData();
    setActionHandler();
  };
  onMounted(() => {
    nextTick(() => {
      createResourcesChunkRequest();
    });
  });
  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.List
  };
</script>

<style lang="less" scoped>
  .projects {
    .title {
      display: flex;
      align-items: center;

      :deep(.arco-icon) {
        margin-right: 6px;
        color: var(--color-text-2);
        font-size: 20px;
        border-radius: var(--border-radius-small);
        cursor: pointer;
        .hoverable();

        &:hover {
          color: rgb(var(--arcoblue-6));
          .hoverableHover();
        }
      }

      .arco-icon.active {
        color: rgb(var(--arcoblue-6));
        box-shadow: var(--seal-hoverable-shadow);
      }
    }

    .content {
      :deep(.arco-tabs-nav-tab) {
        display: none;
      }

      :deep(.arco-tabs-content) {
        padding-top: 0;
      }
    }
  }
</style>
