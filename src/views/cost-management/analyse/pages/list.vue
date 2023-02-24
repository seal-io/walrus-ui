<template>
  <ComCard top-gap class="workflows-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <!-- <dateRange
          v-model:timeUnit="queryParams.timeUnit"
          v-model:start="queryParams.start"
          v-model:end="queryParams.end"
          today-in
        ></dateRange> -->
        <a-input
          v-model="queryParams.name"
          allow-clear
          style="width: 240px"
          :placeholder="$t('cost.analyse.table.holder')"
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
    <!-- <a-divider :margin="8"></a-divider> -->
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
          data-index="builtin"
          :title="$t('cost.analyse.table.type')"
        >
          <template #cell="{ record }">
            <span>{{
              record.builtin
                ? $t('cost.analyse.table.builtin')
                : $t('cost.analyse.table.custom')
            }}</span>
          </template>
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="spend"
          :title="$t('cost.analyse.table.currentCost')"
        >
        </a-table-column> -->
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="startTime"
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
            <a-tooltip :content="$t('common.button.detail')">
              <a-link type="text" size="small" @click="handleView(record)">
                <template #icon><icon-list class="size-16" /></template>
              </a-link>
            </a-tooltip>
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
      :title="$t('cost.analyse.table.create')"
    ></CreatePerspective>
  </ComCard>
</template>

<script lang="ts" setup>
  import { map, capitalize, cloneDeep } from 'lodash';
  import { reactive, ref, onMounted } from 'vue';
  import { useCostManageStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { PerspectiveRowData } from '../config/interface';
  import CreatePerspective from '../components/create-perspectiv.vue';
  import { queryPerspectives } from '../api';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const costManageStore = useCostManageStore();
  const { router } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const showDrawer = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    name: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<PerspectiveRowData[]>([]);
  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await queryPerspectives(queryParams);
      dataList.value = data?.items || [];
      total.value = data?.pagination.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
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
    queryParams.name = '';
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
    // showDrawer.value = true;
    router.push({
      name: 'costPerspectiveEdit'
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
    let routeName = 'costAnalyseAll';
    if (capitalize(row.name) === 'Cluster') {
      routeName = 'costAnalyseCluster';
    }
    if (capitalize(row.name) === 'Project') {
      routeName = 'costAnalyseProject';
    }
    const sKey = `cost${row.id}`;
    costManageStore.setFilterInfo({
      [sKey]: [...cloneDeep(row.allocationQueries)]
    });
    router.push({ name: routeName, query: { id: row.id } });
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped></style>
