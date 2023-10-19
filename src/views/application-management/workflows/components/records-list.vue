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
          data-index="createTime"
          title="开始运行时间"
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
          :title="$t('applications.workflow.table.status')"
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
          data-index="createTime"
          title="运行详情"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="duration"
          title="持续时间"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="description"
          :title="$t('applications.workflow.table.trigger')"
        >
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <DropButtonGroup
              layout="horizontal"
              :actions="recordActions"
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
  import { ref, reactive } from 'vue';
  import { PageAction } from '@/views/config';
  import { PROJECT, WORKFLOW } from '@/router/config';
  import useCallCommon from '@/hooks/use-call-common';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import { recordActions } from '../config';
  import { PipelineRecordsRow } from '../config/interface';
  import { queryPipelineRecords, deletePipeline } from '../api';

  let timer: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const { route, router } = useCallCommon();
  const loading = ref(false);
  const dataList = ref<PipelineRecordsRow[]>([]);
  const total = ref(0);
  const queryParams = reactive({
    id: route.params.flowId || '',
    page: 1,
    perPage: 10
  });
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

  const handleDropSelect = (val, row) => {
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
  const handleView = (row) => {
    router.push({
      name: WORKFLOW.Detail,
      params: {
        ...route.params
      },
      query: {
        flowId: row.id
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

  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
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
  fetchData();
</script>
