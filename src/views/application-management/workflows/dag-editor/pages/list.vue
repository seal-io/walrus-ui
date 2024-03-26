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
          <a-button type="primary" @click="handleCreateDAG"
            >New Workflow</a-button
          >
        </template>
      </FilterBox>
      <a-table
        class="workflow-table"
        column-resizable
        style="margin-bottom: 20px"
        :bordered="false"
        :loading="loading"
        :data="dataList"
        :pagination="false"
        row-key="id"
        :row-selection="
          userStore.hasProjectResourceActions({
            projectID,
            resource: Resources.Workflows,
            actions: [Actions.DELETE]
          })
            ? rowSelection
            : null
        "
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
                type: $t('applications.workflow.name')
              })
            "
            :body-cell-class="
              (record) => {
                return userStore.hasProjectResourceActions({
                  projectID: record.project?.id,
                  resource: Resources.WorkflowExecutions,
                  actions: [Actions.GET]
                })
                  ? 'clickable'
                  : '';
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
              <a-link>{{ record.metadata.name }}</a-link>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="left"
            data-index="status"
            :title="$t('applications.workflow.table.status')"
          >
            <template #cell="{ record }">
              <span class="flex">
                <StatusLabel
                  :zoom="0.9"
                  :status="{
                    summaryStatus: _.get(record, 'status.phase', '')
                  }"
                ></StatusLabel>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            :cell-style="{ minWidth: '40px' }"
            align="left"
            data-index="status.progress"
            title="Progress"
          >
            <template #cell="{ record }">
              <span>{{ _.get(record, 'status.progress', '') }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="left"
            data-index="executions.0.createTime"
            :title="$t('applications.workflow.table.update')"
          >
            <template #cell="{ record }">
              <span>{{
                _.get(record, 'executions.0.createTime')
                  ? dayjs(_.get(record, 'executions.0.createTime')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  : '-'
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
            align="left"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record, rowIndex }">
              <DropButtonGroup
                v-if="setActionList(record).length"
                :layout="
                  setActionList(record).length === 1 ? 'horizontal' : 'vertical'
                "
                :actions="setActionList(dataList[rowIndex])"
                @select="(val) => handleDropSelect(val, record)"
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
                    type: $t('applications.workflow.name')
                  })
                : $t('project.environment.result.title.type', {
                    type: $t('applications.workflow.name')
                  })
            "
            :subtitle="
              queryParams.query ? $t('common.result.nodata.subtitle') : ''
            "
          >
            <template #icon>
              <icon-find-replace v-if="queryParams.query" />
              <i v-else class="iconfont icon-pipeline-2"></i>
            </template>
            <template #extra>
              <a-button
                v-if="
                  userStore.hasProjectResourceActions({
                    projectID,
                    resource: Resources.Workflows,
                    actions: [Actions.POST]
                  })
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
      <runConfig
        v-model:show="showConfig"
        :info="dataInfo"
        @save="handleSave"
      ></runConfig>
    </div>
  </ComCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import _, { map, pickBy } from 'lodash';
  import { ordinalNumber } from '@/utils/func';
  import { PageAction } from '@/views/config';
  import { PROJECT, WORKFLOW } from '@/router/config';
  import { useUserStore } from '@/store';
  import { Resources, Actions } from '@/permissions/config';
  import useLocale from '@/hooks/locale';
  import { ref, reactive, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import SealSteps from '@/components/seal-steps/index.vue';
  import runConfig from '../../components/run-config.vue';

  import { moreActions, WorkflowStatusList } from '../../config';
  import { PipelineRow } from '../../config/interface';
  import { queryWorkflows, deleteWorkflow } from '../api';
  import { applyPipeline } from '../../api';

  let timer: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  const { currentLocale } = useLocale();
  const userStore = useUserStore();
  const { router, route } = useCallCommon();
  const loading = ref(false);
  const dataList = ref<PipelineRow[]>([]);
  const total = ref(0);
  const projectID = route.params.projectId as string;
  const dataInfo = ref<any>({});
  const showConfig = ref(false);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const { setChunkRequest } = useSetChunkRequest();
  const { updateChunkedList } = useUpdateChunkedList(dataList);

  const setRunStatus = (row) => {
    const stages = _.get(row, 'executions.0.stages') || [];

    return _.map(stages, (item) => {
      return {
        title: item.name,
        info: item.status?.summaryStatusMessage,
        status: item.status?.summaryStatus,
        colorStatus:
          _.find(WorkflowStatusList, (s) => _.get(item.status, s)) || 'ready'
      };
    });
  };

  const setActionList = (row) => {
    const list = _.filter(moreActions, (item) => {
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

  const handleCreate = () => {
    router.push({
      name: WORKFLOW.Edit,
      params: {
        projectId: route.params.projectId,
        action: PageAction.EDIT
      }
    });
  };
  const handleCreateDAG = () => {
    router.push({
      name: 'WorkflowDag',
      params: {
        projectId: route.params.projectId,
        action: PageAction.EDIT,
        name: 'argo'
      }
    });
  };

  const fetchData = async () => {
    try {
      loading.value = true;

      const { data } = await queryWorkflows();
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    fetchData();
  };

  const handleApply = async (row) => {
    try {
      dataInfo.value = row;
      setTimeout(() => {
        showConfig.value = true;
      }, 100);
    } catch (error) {
      // ignore
    }
  };
  const handleApplyFlow = async (data) => {
    try {
      await applyPipeline({
        ...data,
        projectId: dataInfo.value.project?.id
      });
      execSucceed('applications.workflow.table.runmsg');
    } catch (error) {
      // ignore
    }
  };

  const handleSave = async (data) => {
    handleApplyFlow(data);
  };

  const handleView = (row) => {
    router.push({
      name: 'WorkflowDag',
      params: {
        projectId: route.params.projectId,
        action: PageAction.EDIT,
        name: row.metadata.name
      },
      query: {
        uid: row.metadata.uid
      }
    });
  };

  const handleCellClick = (row, col) => {
    if (col.dataIndex === 'name') {
      handleView(row);
    }
  };
  const handleViewResult = (row) => {
    router.push({
      name: WORKFLOW.Detail,
      params: {
        projectId: row.project?.id,
        flowId: row.id
      },
      query: {
        execId: _.get(row, 'executions.0.id')
      }
    });
  };
  const handleDeleteConfirm = async (row) => {
    try {
      loading.value = true;
      // const ids = map(delList || selectedKeys.value, (val) => {
      //   return {
      //     id: val as string
      //   };
      // });
      await deleteWorkflow({ name: row.metadata.name });
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
  const handleDelete = async (row) => {
    deleteModal({ onOk: () => handleDeleteConfirm(row) });
  };

  const handleDropSelect = (val, row) => {
    if (val === 'apply') {
      handleApply(row);
      return;
    }
    if (val === 'edit') {
      router.push({
        name: WORKFLOW.Edit,
        params: {
          projctId: row.project?.id
        },
        query: {
          flowId: row.id
        }
      });
      return;
    }
    if (val === 'delete') {
      handleDelete(row);
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createWorkflowsChunkRequest = () => {
    // const url = `${PROJECT_API_PREFIX()}${PIPELINE_API}`;
    // try {
    //   setChunkRequest({
    //     url: `${url}`,
    //     params: {
    //       ..._.pickBy(_.omit(queryParams, ['page', 'perPage']), (val) => !!val)
    //     },
    //     handler: updateHandler
    //   });
    // } catch (error) {
    //   // ignore
    // }
  };

  onMounted(() => {
    createWorkflowsChunkRequest();
  });
  fetchData();
</script>

<style lang="less"></style>
