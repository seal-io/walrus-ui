<template>
  <div class="workflows-list">
    <FilterBox style="margin-bottom: 6px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 240px"
          :placeholder="$t('cost.analyse.detail.holder')"
          @clear="handleSearch"
          @change="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </template>
    </FilterBox>
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :pagination="false"
    >
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
  import { map } from 'lodash';
  import { reactive, ref, onMounted, PropType } from 'vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { commonRequestList } from '@/api/commonListRequest';
  import { CostAnalyRow } from '../config/interface';

  const props = defineProps({
    columns: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    api: {
      type: String,
      default() {
        return '';
      }
    }
  });
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    query: '',
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

  const fetchData = async () => {
    if (!props.api) return;
    try {
      const { data } = await commonRequestList(props.api, queryParams);
    } catch (error) {
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

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped></style>
