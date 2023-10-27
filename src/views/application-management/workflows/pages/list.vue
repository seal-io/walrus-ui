<template>
  <ComCard borderless padding="0">
    <div>
      <FilterBox style="margin-bottom: 10px">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('applications.workflow.filter.holder')"
            @clear="handleSearch"
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
                projectID,
                resource: Resources.Environments,
                actions: [Actions.POST]
              })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('applications.workflow.create') }}</a-button
          >
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                projectID,
                resource: Resources.Environments,
                actions: [Actions.DELETE]
              })
            "
            type="primary"
            status="warning"
            :disabled="!selectedKeys.length"
            @click="handleDelete"
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
            :title="$t('applications.workflow.name')"
          >
            <template #cell="{ record }">
              <a-link type="text" size="small" @click="handleView(record)">
                {{ record.name }}
              </a-link>
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
                <a-tooltip
                  v-if="_.get(record, 'executions.0.version')"
                  :content="
                    $t('workflow.task.run.order', {
                      order:
                        currentLocale === 'en-US'
                          ? ordinalNumber(_.get(record, 'executions.0.version'))
                          : _.get(record, 'executions.0.version')
                    })
                  "
                >
                  <a-button
                    type="text"
                    style="padding-left: 0"
                    @click="handleViewResult(record)"
                  >
                    #{{ _.get(record, 'executions.0.version') }}
                  </a-button>
                </a-tooltip>
                <StatusLabel
                  :zoom="0.9"
                  :status="{
                    status: _.get(record, 'executions.0.status.summaryStatus'),
                    text: _.get(record, 'executions.0.status.summaryStatus'),
                    message: _.get(
                      record,
                      'executions.0.status.summaryStatusMessage'
                    ),
                    transitioning: _.get(
                      record,
                      'executions.0.status.transitioning'
                    ),
                    error: _.get(record, 'executions.0.status.error')
                  }"
                ></StatusLabel>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="left"
            data-index="stages"
            :title="$t('applications.workflow.table.stage')"
          >
            <template #cell="{ record }">
              <SealSteps :steps="setRunStatus(record)"></SealSteps>
            </template>
          </a-table-column>
          <!-- <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="description"
            :title="$t('applications.workflow.table.trigger')"
          >
          </a-table-column> -->
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="executions.0.trigger.user"
            :title="$t('workflow.task.run.user')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
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
            align="center"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record }">
              <DropButtonGroup
                layout="horizontal"
                :actions="moreActions"
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

  import { moreActions } from '../config';
  import { PipelineRow } from '../config/interface';
  import {
    queryPipelines,
    deletePipeline,
    applyPipeline,
    PROJECT_API_PREFIX,
    PIPELINE_API
  } from '../api';

  let timer: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const { currentLocale } = useLocale();
  const userStore = useUserStore();
  const { router, route } = useCallCommon();
  const loading = ref(false);
  const dataList = ref<PipelineRow[]>([]);
  const total = ref(0);
  const projectID = route.params.projectId as string;
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
        status: item.status.error ? 'Error' : item.status?.summaryStatus
      };
    });
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

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };

      const { data } = await queryPipelines(params);
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

  const handleApplyFlow = async (row) => {
    try {
      await applyPipeline({ id: row.id });
      execSucceed('applications.workflow.table.runmsg');
    } catch (error) {
      // ignore
    }
  };
  const handleDropSelect = (val, row) => {
    if (val === 'apply') {
      handleApplyFlow(row);
      return;
    }
    router.push({
      name: WORKFLOW.Edit,
      params: {
        ...route.params
      },
      query: {
        flowId: row.id
      }
    });
  };
  const handleView = (row) => {
    router.push({
      name: WORKFLOW.Records,
      params: {
        ...route.params,
        flowId: row.id
      }
    });
  };

  const handleViewResult = (row) => {
    router.push({
      name: WORKFLOW.Detail,
      params: {
        ...route.params,
        flowId: row.id
      },
      query: {
        execId: _.get(row, 'executions.0.id')
      }
    });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deletePipeline({ items: ids });
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
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createWorkflowsChunkRequest = () => {
    const url = `${PROJECT_API_PREFIX()}${PIPELINE_API}`;
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

  onMounted(() => {
    createWorkflowsChunkRequest();
  });
  fetchData();
</script>

<style lang="less" scoped></style>
