<template>
  <div class="table-list-wrap">
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
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :pagination="false"
    >
    </a-table>
    <a-pagination
      style="margin-top: 20px"
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
  import { map, omit, pick, get } from 'lodash';
  import { reactive, ref, onMounted, PropType, watchEffect, watch } from 'vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { CostAnalyRow, FilterParamsType } from '../config/interface';
  import { queryPerspectiveData } from '../api';
  import testData from '../config/testData';

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
    },
    filterParams: {
      type: Object as PropType<FilterParamsType>,
      default() {
        return {};
      }
    },
    loadeend: {
      type: Boolean,
      default() {
        return true;
      }
    },
    source: {
      type: String,
      default() {
        return '';
      }
    },
    timeRange: {
      type: String,
      default() {
        return '';
      }
    },
    timeMode: {
      type: String,
      default() {
        return 'utc';
      }
    }
  });
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<CostAnalyRow[]>([]);

  const setStartTime = () => {
    const start = dayjs(props.filterParams.startTime)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    if (props.timeMode === 'utc') {
      return dayjs(start).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
    return dayjs(start).format();
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      // props.timeRange === 'single'
      console.log('filterParams===', props.filterParams);
      const params = {
        source: props.source,
        ...omit(props.filterParams, 'step'),
        startTime: get(props.filterParams, 'step')
          ? setStartTime()
          : props.filterParams.startTime,
        // ),
        query: queryParams.query,
        paging: {
          ...pick(queryParams, ['page', 'perPage'])
        }
      };
      const { data } = await queryPerspectiveData(params);
      dataList.value = data?.items || [];
      console.log('tableList===', props.source, dataList.value);
      // dataList.value = testData;
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      dataList.value = [];
      // dataList.value = testData;
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
  watchEffect(() => {
    // fetchData();
  });
  watch(
    () => props.filterParams,
    () => {
      if (props.loadeend) {
        fetchData();
      }
    },
    {
      immediate: false
    }
  );
</script>

<style lang="less" scoped>
  .table-list-wrap {
    :deep(.arco-table-th) {
      background-color: rgba(230, 244, 254, 0.5);
    }
  }
</style>
