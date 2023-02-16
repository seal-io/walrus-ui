<template>
  <ComCard top-gap class="workflows-list">
    <FilterBox>
      <template #params>
        <dateRange
          v-model:timeUnit="queryParams.timeUnit"
          v-model:start="queryParams.start"
          v-model:end="queryParams.end"
          today-in
        ></dateRange>
        <a-select
          v-model="queryParams.timeUnit"
          allow-clear
          allow-search
          :options="viewList"
          style="width: 160px"
          :placeholder="$t('cost.analyse.table.holder')"
          @clear="handleSearch"
          @change="handleSearch"
        >
        </a-select>
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
          $t('cost.analyse.table.create')
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
    <a-divider :margin="8"></a-divider>
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
          :title="$t('cost.analyse.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="type"
          :title="$t('cost.analyse.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="spend"
          :title="$t('cost.analyse.table.currentCost')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="time"
          :title="$t('cost.analyse.table.time')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-link type="text" size="small" @click="handleView(record)">
              <template #icon><icon-list style="font-size: 16px" /></template>
            </a-link>
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
    <CreatePerspective
      v-model:show="showDrawer"
      title="创建视角"
    ></CreatePerspective>
  </ComCard>
</template>

<script lang="ts" setup>
  import { map } from 'lodash';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import DateRange from '@/views/dashboard/components/date-range.vue';
  import { CostAnalyRow } from '../config/interface';
  import CreatePerspective from '../components/create-perspectiv.vue';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const showDrawer = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    perspective: '1',
    start: '',
    end: '',
    timeUnit: 'day',
    page: 1,
    perPage: 10
  });
  const dataList = ref<CostAnalyRow[]>(
    Array(10).fill({
      name: 'app-1',
      createTime: '2023-02-09',
      type: 'BuiltIn',
      spend: '$100.345',
      time: 'Last 7 Days'
    })
  );
  const viewList = ref<{ label: string; value: string }[]>([
    { label: 'view-1', value: '1' },
    { label: 'view-2', value: '2' },
    { label: 'view-3', value: '3' }
  ]);
  const fetchData = async () => {};
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
    queryParams.perspective = '';
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
    showDrawer.value = true;
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      // await deleteRepos(ids);
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleView = (row) => {
    router.push({ name: 'costAnalyseAll', query: { id: row.id } });
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    console.log('workflows');
  });
</script>

<style lang="less" scoped></style>
