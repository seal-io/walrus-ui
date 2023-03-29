<template>
  <div class="container">
    <SpinCard title="成本优化" borderless style="margin-bottom: 10px">
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in saveOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)"
          >
            <template #suffix>
              <span style="font-size: 26px">{{ item?.suffix || '' }}</span>
            </template>
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
      <a-grid :cols="24" :col-gap="20" style="margin-top: 10px">
        <a-grid-item
          v-for="(item, index) in k8sOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="linear-gradient(rgba(255, 197, 192,.3) 0%,rgba(255, 197, 192,.4) 100%)"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
    </SpinCard>
    <SpinCard title="集群" borderless style="margin-bottom: 10px">
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
        :pagination="false"
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
            data-index="region"
            :title="$t('cost.optimize.table.region')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="nodes"
            :title="$t('cost.optimize.table.nodes')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="cost"
            :title="$t('cost.optimize.table.clusterCost')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="saving"
            :title="$t('cost.optimize.table.costdown')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="status"
            :title="$t('cost.optimize.table.status')"
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
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DataCard from '@/components/data-card/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import { k8sOverview, saveOverview } from '../config';

  const { t, router } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<any[]>(
    Array(10).fill({
      name: 'app-1',
      createTime: '2023-02-09',
      type: 'BuiltIn',
      spend: '$100.345',
      time: 'Last 7 Days'
    })
  );

  const fetchData = async () => {
    try {
      // TODO
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
  const handleView = (row) => {
    router.push({
      name: 'CostOptimizeClusterDetail',
      query: row.id
    });
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style></style>
