<template>
  <div class="connectors-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 240px"
          :placeholder="$t('operation.connectors.table.holder')"
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
        <a-button type="primary" @click="handleCreate">{{
          $t('operation.connectors.create')
        }}</a-button>
        <a-button
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
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('operation.connectors.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="finOpsStatus"
          :title="$t('operation.connectors.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: get(record, 'status.summaryStatus'),
                text: get(record, 'status.summaryStatus'),
                message: get(record, 'status.statusMessage'),
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
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="enableFinOps"
          :title="$t('operation.connectors.table.enableFin')"
        >
          <template #cell="{ record }">
            <a-switch
              v-model="record.enableFinOps"
              size="small"
              @change="(val) => handleEnableFinOps(val, record)"
            ></a-switch>
          </template>
        </a-table-column>
        <a-table-column
          align="center"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
        >
          <template #cell="{ record }">
            <a-space :size="10">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  type="text"
                  size="small"
                  @click="handleClickEdit(record)"
                >
                  <template #icon><icon-edit class="size-16" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip
                v-if="record.enableFinOps"
                :content="$t('operation.connectors.table.install')"
              >
                <a-link
                  type="text"
                  size="small"
                  @click="handleReinstall(record)"
                >
                  <template #icon
                    ><icon-font type="icon-install" class="size-16"
                  /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip
                v-if="record.enableFinOps"
                :content="$t('operation.connectors.table.fetch')"
              >
                <a-link
                  type="text"
                  size="small"
                  :loading="record.loading"
                  @click="handleFetchCost(record)"
                >
                  <template #icon
                    ><icon-cloud-download class="size-16"
                  /></template>
                </a-link>
              </a-tooltip>
              <!-- <a-link type="text" size="small" :href="handleView(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                {{ $t('common.button.detail') }}
              </a-link> -->
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
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { get, map, pickBy } from 'lodash';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { ConnectorRowData } from '../config/interface';
  import StatusLabel from './status-label.vue';
  import {
    queryConnectors,
    updateConnector,
    reinstallFinOpsTools,
    syncFinOpsData,
    deleteConnector
  } from '../api';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<ConnectorRowData[]>([]);
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val)
      };
      const { data } = await queryConnectors(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      console.log(error);
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
  const handleCreate = () => {
    router.push({
      name: 'connectorK8sDetail'
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
      await deleteConnector(ids);
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
  const handleEdit = (row) => {
    const path = router.resolve({
      name: 'applicationsDetail',
      query: { id: row.id }
    });
    return path.href;
  };
  const handleClickEdit = (row) => {
    router.push({
      name: 'connectorK8sDetail',
      query: { id: row.id }
    });
  };
  const handleReinstallConfirm = async (row) => {
    try {
      loading.value = true;
      await reinstallFinOpsTools(row);
      Message.success(t('common.message.success'));
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleReinstall = async (row) => {
    deleteModal({
      title: 'operation.connectors.reinstall.tips',
      okText: 'operation.connectors.reinstall.button',
      onOk: () => {
        handleReinstallConfirm(row);
      }
    });
  };
  const handleFetchCost = async (row) => {
    try {
      row.loading = true;
      await syncFinOpsData(row);
      Message.success(t('common.message.success'));
      row.loading = false;
    } catch (error) {
      row.loading = false;
      console.log(error);
    }
  };
  const handleEnableFinOps = async (enable, row) => {
    try {
      loading.value = true;
      row.enableFinOps = enable;
      await updateConnector(row);
      loading.value = false;
      Message.success(t('common.message.success'));
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleSaveAppInfo = () => {
    queryParams.page = 1;
    handleFilter();
  };
  onMounted(() => {
    fetchData();
    console.log('application list');
  });
</script>

<style lang="less" scoped></style>
