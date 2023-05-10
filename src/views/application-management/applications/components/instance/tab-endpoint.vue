<template>
  <div class="resource-wrap">
    <a-table
      :loading="loading"
      column-resizable
      style="margin-bottom: 10px"
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="moduleName"
          :title="$t('applications.applications.table.module')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="type"
          :title="$t('applications.applications.instance.endpoint')"
        >
          <template #cell="{ record }">
            <a-space
              v-if="record?.endpoints?.length"
              direction="vertical"
              :size="5"
            >
              <a-link
                v-for="(item, index) in record.endpoints"
                :key="index"
                style="line-height: 1"
                :href="
                  includes(item, 'https') || includes(item, 'http')
                    ? item
                    : `http://${item}`
                "
                target="_blank"
                >{{
                  record.resourceSubKind === 'NodePort'
                    ? get(split(item, ':'), 1)
                    : item
                }}</a-link
              >
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="
        queryParams.perPage === 10 || queryParams.page === -1
      "
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    /> -->
  </div>
</template>

<script lang="ts" setup>
  import { split, get, includes } from 'lodash';
  import {
    onMounted,
    ref,
    reactive,
    inject,
    watch,
    defineExpose,
    onBeforeUnmount
  } from 'vue';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import { EndPointRow } from '../../config/interface';
  import { queryInstanceEndpoints } from '../../api';

  let axiosInstance = createAxiosToken();
  const instanceId = inject('instanceId', ref(''));
  const total = ref(0);
  const loading = ref(false);
  const queryParams = reactive({
    page: -1
  });
  const dataList = ref<EndPointRow[]>([]);
  const fetchData = async () => {
    axiosInstance?.cancel?.();
    axiosInstance = createAxiosToken();
    try {
      loading.value = true;
      const params = {
        ...queryParams,
        instanceID: instanceId.value
      };
      const { data } = await queryInstanceEndpoints(
        params,
        axiosInstance?.token
      );
      dataList.value = data || [];
      loading.value = false;
    } catch (error) {
      dataList.value = [];
      loading.value = false;
      console.log(error);
    }
  };

  const handleFilter = () => {
    fetchData();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };

  const refreshDataList = () => {
    queryParams.page = 1;
    fetchData();
  };
  const handleShowLogs = () => {};
  const handleShowTerm = () => {};
  watch(
    () => instanceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
    },
    {
      immediate: true
    }
  );
  defineExpose({
    refreshDataList
  });
  onMounted(() => {
    console.log('resource');
  });
  onBeforeUnmount(() => {
    axiosInstance?.cancel?.();
  });
</script>

<style></style>
