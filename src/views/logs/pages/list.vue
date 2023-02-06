<template>
  <div class="container">
    <a-space class="filter-wrap">
      <a-space>
        <a-select
          v-model="query.types"
          :style="{ width: '200px' }"
          :placeholder="$t('logs.list.events')"
          allow-clear
          @change="handlerSearch"
        >
          <a-option
            v-for="item in eventType"
            :key="item.value"
            :value="item.value"
            >{{ $t(item.label) }}</a-option
          >
        </a-select>
        <a-select
          v-model="query.statuses"
          :style="{ width: '200px' }"
          :placeholder="$t('logs.list.status')"
          allow-clear
          @change="handlerSearch"
        >
          <a-option
            v-for="item in statusList"
            :key="item.value"
            :value="item.value"
            >{{ $t(item.label) }}</a-option
          >
        </a-select>
        <a-input
          v-model="query.objectName"
          allow-clear
          :placeholder="$t('logs.list.holder')"
          style="width: 300px"
          @clear="handlerSearch"
          @change="handlerSearch"
          @press-enter="handlerSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <!-- <a-button
          type="primary"
          style="margin-left: 15px"
          @click="handlerSearch"
          >{{ $t('common.button.search') }}</a-button
        > -->
        <a-button
          type="primary"
          style="margin-left: 15px"
          @click="handlerReset"
          >{{ $t('common.button.reset') }}</a-button
        >
      </a-space>
      <a-button
        type="primary"
        status="warning"
        :disabled="!selectedKeys.length"
        @click="handleDelete"
        >{{ $t('common.button.delete') }}</a-button
      >
    </a-space>
    <a-card class="general-card q-s-w-card">
      <a-space direction="vertical" :size="20" fill>
        <a-table
          column-resizable
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
              :cell-style="{ minWidth: '40px', maxWidth: '200px' }"
              :title="$t('logs.list.time')"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend',
                sorter: true,
                sortOrder: sortOrder,
              }"
              data-index="createTime"
            >
              <template #cell="{ record }">
                <!-- <span>{{
                  `${record.year}-${record.month}-${record.day} ${record.hour}:${record.min}:${record.sec}`
                }}</span> -->
                <span>{{
                  dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '60px' }"
              :title="$t('logs.list.events')"
              data-index="type"
            >
              <template #cell="{ record }">
                <span>{{ $t(getEventType(record.type)) }}</span>
              </template>
            </a-table-column>
            <!-- <a-table-column :title="$t('logs.list.source')" data-index="policy">
              <template #cell="{ record }">
                <span>
                  {{ `${record.policy}` }}
                </span>
              </template>
            </a-table-column> -->
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              :title="$t('logs.list.object')"
              data-index="objectName"
            >
              <template #cell="{ record }">
                <span>{{
                  record.objectName.indexOf('#') > -1
                    ? `${record.objectName.split('#')[0]}`
                    : record.objectName
                }}</span>
                <a-link
                  v-if="record.objectName.indexOf('#') > -1"
                  :href="record.objectLink"
                  target="_blank"
                  >{{ `#${record.objectName.split('#')[1]}` }}</a-link
                >
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px', maxWidth: '100px' }"
              :title="$t('logs.list.status')"
              data-index="status"
            >
              <template #cell="{ record }">
                <span class="status" :class="[record.status]">{{
                  $t(getStatus(record.status))
                }}</span>
              </template>
            </a-table-column>
            <!-- <a-table-column
              :title="$t('logs.list.risk')"
              data-index="risk"
              :filterable="filterableList"
            >
              <template #cell="{ record }">
                <div>
                  <span class="high"
                    >{{ $t('logs.risk.high') }}
                    <span class="value">{{ record.highRisk }}</span></span
                  >
                  <span class="middle"
                    >{{ $t('logs.risk.middle') }}
                    <span class="value">{{ record.middleRisk }}</span></span
                  >
                  <span class="low"
                    >{{ $t('logs.risk.low') }}
                    <span class="value">{{ record.lowRisk }}</span></span
                  >
                </div>
              </template>
            </a-table-column> -->
            <a-table-column
              :title="$t('logs.list.operate')"
              :width="150"
              align="center"
            >
              <template #cell="{ record }">
                <a-link
                  type="text"
                  :href="resolvePath(record)"
                  target="_blank"
                  >{{ $t('logs.list.viewReport') }}</a-link
                >
              </template>
            </a-table-column>
          </template>
        </a-table>
        <a-pagination
          size="small"
          :total="total"
          :page-size="pagination.perPage"
          :current="pagination.page"
          show-total
          show-page-size
          :hide-on-single-page="pagination.perPage === 10"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { map, cloneDeep, assignIn } from 'lodash';
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import pickBy from 'lodash/pickBy';
  import dayjs from 'dayjs';
  import { ref, reactive, computed, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Modal, Message } from '@arco-design/web-vue';
  import {
    LogsTableRow,
    queryLogsDataList,
    deleteLogsById,
    LogsTableParams,
  } from '@/api/logs';
  import useLoading from '@/hooks/loading';
  import { UseSortDirection } from '@/utils/common';
  import { useWebsocket, wssEventList } from '@/hooks/use-websocket';
  import { statusList, eventType, riskLevelList } from '../config';

  const { t } = useI18n();
  const router = useRouter();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend',
  });
  const dataList = ref<LogsTableRow[]>([]);
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);
  const total = ref<number>(0);
  const basePagination: Pagination = {
    page: 1,
    perPage: 10,
  };
  const query = reactive({
    types: '',
    statuses: '',
    objectName: '',
    sort: '-createTime',
  });
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    ...basePagination,
  });
  const filterableList = computed(() => {
    return {
      multiple: true,
      filters: riskLevelList.map((item) => {
        return {
          text: t(item.label),
          value: item.value,
        };
      }),
      filter: (value: any, record: any) => record.riskLevel === value,
    };
  });
  const getStatus = (val: string | number) => {
    const obj = statusList.find((item) => item.value === val);
    return obj ? obj.label : '';
  };

  const getEventType = (val: string | number) => {
    const obj = eventType.find((item) => item.value === val);
    return obj ? obj.label : '';
  };

  const handleViewReport = (row: any) => {
    // const url = `/v1/reports/${row.id}`;
    // window.open(url, '_blank');
    router.push({
      name: 'eventReport',
      query: {
        id: row.id,
      },
    });
  };
  const resolvePath = (row: any) => {
    const path = router.resolve({ name: 'eventReport', query: { id: row.id } });
    return path.href;
  };
  const fetchData = async () => {
    let params: LogsTableParams = {
      ...pagination,
      ...query,
    };
    try {
      console.log('params:', params);
      setLoading(true);
      params = pickBy(
        params,
        (val: any) => val || val.length
      ) as LogsTableParams;
      const { data } = await queryLogsDataList(params);
      dataList.value = data.items || [];
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const wssOnMessage = (message) => {
    dataList.value = map(dataList.value, (o) => {
      const item = cloneDeep(o);
      if (item.id === message.id) {
        assignIn(item, message);
      }
      return item;
    });
  };
  const loopUpdateRunTime = () => {
    dataList.value = map(dataList.value, (o) => {
      if (o.status === 'running') {
        const item = cloneDeep(o);
        return item;
      }
      return o;
    });
  };
  const createWssConnect = () => {
    const { updateEvaluateTime } = useWebsocket({
      url: wssEventList,
      onmessage: wssOnMessage,
    });
    nextTick(() => {
      updateEvaluateTime(loopUpdateRunTime);
    });
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    query.sort = sort.value;
    console.log('dataIndex===', dataIndex, direction);
    pagination.page = 1;
    fetchData();
  };
  const handleFilter = () => {
    fetchData();
  };

  const handlePageChange = (page: number) => {
    pagination.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1;
    pagination.perPage = pageSize;
    handleFilter();
  };

  const handlerSearch = () => {
    console.log('search');
    pagination.page = 1;
    handleFilter();
  };
  const handlerReset = () => {
    query.types = '';
    query.statuses = '';
    query.objectName = '';
    pagination.page = 1;
    handleFilter();
  };
  const handleSelectAll = (checked: boolean) => {
    console.log({ checked });
  };
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
  };
  const handleFilterChange = (obj: any) => {
    const { dataIndex, filteredValues } = obj;
    console.log({ dataIndex, filteredValues });
  };
  const handleDeleteConfirm = async () => {
    if (!selectedKeys.value.length) return;
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val,
        };
      });
      await deleteLogsById(ids);
      loading.value = false;
      Message.success(t('common.message.success'));
      pagination.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
      console.log(selectedKeys.value);
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
    // Modal.warning({
    //   hideCancel: false,
    //   title: t('common.delete.tips'),
    //   content: '',
    //   onOk: () => {
    //     handleDeleteConfirm();
    //   },
    // });
  };
  createWssConnect();
  fetchData();
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-table-td) {
      .high {
        margin-right: 10px;
        color: rgb(var(--danger-6));
      }

      .middle {
        margin-right: 10px;
        color: rgb(var(--orange-6));
      }

      .low {
        margin-right: 10px;
        color: rgb(var(--gray-6));
      }

      .high .value,
      .middle .value,
      .low .value {
        color: rgb(var(--gray-10));
      }

      .status {
        &::before {
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 5px;
          vertical-align: middle;
          border-radius: 50%;
          content: '';
        }

        &.permit::before {
          background-color: rgb(var(--success-6));
        }

        &.warn::before {
          background-color: rgb(var(--warning-6));
        }

        &.block::before {
          background-color: rgb(var(--danger-6));
        }

        &.error::before {
          background-color: rgb(var(--danger-6));
        }

        &.running::before {
          background-color: rgb(var(--primary-6));
        }
      }
    }

    // :deep(.arco-btn-primary.arco-btn-status-warning) {
    //   background-color: rgb(134, 144, 156);
    //   transition: all 0.3s;

    //   &:hover {
    //     background-color: rgba(134, 144, 156, 0.7);
    //     transition: all 0.3s;
    //   }
    // }
    :deep(.arco-card-body) {
      padding: 20px;
    }

    :deep(.arco-select) {
      background-color: #fff;
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
    }

    :deep(.arco-tabs-content) {
      display: none;
    }

    :deep(.arco-input-wrapper) {
      background: #fff;

      .acro-input {
        background: #fff;
      }
    }

    :deep(.arco-tabs-nav-tab-list) {
      background: #fff;
    }

    .filter-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
  }
</style>
