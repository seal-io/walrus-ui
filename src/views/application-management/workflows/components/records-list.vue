<template>
  <div>
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
          align="center"
          :width="60"
          data-index="version"
          title="#"
        >
          <template #cell="{ record }">
            <a-tooltip
              v-if="record.version"
              :content="
                $t('workflow.task.run.order', {
                  order:
                    currentLocale === 'en-US'
                      ? ordinalNumber(record.version)
                      : record.version
                })
              "
            >
              <a-button
                v-if="
                  userStore.hasProjectResourceActions({
                    projectID,
                    resource: Resources.WorkflowExecutions,
                    actions: [Actions.GET]
                  })
                "
                type="text"
                style="padding-left: 0"
                @click="handleViewResult(record)"
              >
                #{{ record.version }}
              </a-button>
              <span v-else> #{{ record.version }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="createTime"
          :title="$t('applications.workflow.table.startTime')"
        >
          <template #cell="{ record }">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="status"
          :title="$t('applications.workflow.table.currentStatus')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :zoom="0.9"
              :status="{
                status: _.get(record, 'status.summaryStatus'),
                text: _.get(record, 'status.summaryStatus'),
                message: _.get(record, 'status.summaryStatusMessage'),
                transitioning: _.get(record, 'status.transitioning'),
                error: _.get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :body-cell-style="{ fontSize: 0 }"
          align="left"
          data-index="details"
          :title="$t('applications.workflow.table.runDetails')"
        >
          <template #cell="{ record }">
            <SealSteps
              :steps="setRunStatus(record)"
              class="flex-center"
            ></SealSteps>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="trigger.user"
          :title="$t('workflow.task.run.user')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="duration"
          :title="$t('applications.workflow.table.duration')"
        >
          <template #cell="{ record }">
            <span>{{ setDurationValue(record.duration) }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="description"
          :title="$t('common.table.mark')"
        >
        </a-table-column>
        <a-table-column
          align="center"
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
              @select="(val) => handleDropSelect(val, record)"
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
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { ref, reactive, onMounted } from 'vue';
  import { setDurationValue } from '@/views/config/utils';
  import { ordinalNumber } from '@/utils/func';
  import useLocale from '@/hooks/locale';
  import { PROJECT, WORKFLOW } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import SealSteps from '@/components/seal-steps/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { recordActions, WorkflowStatusMap } from '../config';
  import { PipelineRecordsRow } from '../config/interface';
  import {
    queryPipelineRecords,
    deletePipelineExecution,
    PROJECT_API_PREFIX,
    PIPELINE_API,
    PIPELINE_EXECUTION_API,
    stopApplyPipeline
  } from '../api';

  let timer: any = null;
  const { currentLocale } = useLocale();
  const { route, router } = useCallCommon();
  const userStore = useUserStore();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const projectID = route.params.projectId as string;
  const loading = ref(false);
  const dataList = ref<PipelineRecordsRow[]>([]);
  const total = ref(0);
  const queryParams = reactive({
    id: route.params.flowId || '',
    page: 1,
    perPage: 10
  });

  const { setChunkRequest } = useSetChunkRequest();
  const { updateChunkedList } = useUpdateChunkedList(dataList);

  const setActionList = (row) => {
    const list = _.filter(recordActions, (item) => {
      return item.filterFun ? item.filterFun(row) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(row)
        : item.disabled;
      return item;
    });
    console.log('res======', res);
    return res;
  };

  const setRunStatus = (row) => {
    const stages = row.stages || [];
    return _.map(stages, (item) => {
      return {
        title: item.name,
        info: item.status?.summaryStatusMessage,
        status: item.status.error
          ? 'Error'
          : _.get(WorkflowStatusMap, item.status?.summaryStatus)
      };
    });
  };

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ..._.pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };

      const { data } = await queryPipelineRecords(params);
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

  const handleViewResult = (row) => {
    router.push({
      name: WORKFLOW.Detail,
      params: {
        ...route.params
      },
      query: {
        execId: row.id
      }
    });
  };

  const handleDeleteConfirm = async (row) => {
    try {
      loading.value = true;
      // const ids = _.map(selectedKeys.value, (val) => {
      //   return {
      //     id: val
      //   };
      // });
      await deletePipelineExecution({
        id: row.id,
        flowId: route.params.flowId as string
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
  const handleDelete = async (row) => {
    deleteModal({ onOk: () => handleDeleteConfirm(row) });
  };

  const handleStopExecution = async (row) => {
    try {
      const params = {
        flowId: route.params.flowId as string,
        execId: row.id
      };
      await stopApplyPipeline(params);
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleDropSelect = (val, row) => {
    if (val === 'delete') {
      handleDelete(row);
      return;
    }
    if (val === 'stop') {
      handleStopExecution(row);
      return;
    }
    router.push({
      name: WORKFLOW.Detail,
      params: {
        ...route.params
      },
      query: {
        execId: row.id
      }
    });
  };

  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createWorkflowsChunkRequest = () => {
    const url = `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      queryParams.id
    }${PIPELINE_EXECUTION_API}`;
    try {
      setChunkRequest({
        url: `${url}`,
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };

  onMounted(() => {
    createWorkflowsChunkRequest();
  });
  fetchData();
</script>
