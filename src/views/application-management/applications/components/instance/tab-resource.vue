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
          :title="$t('applications.applications.table.name')"
        >
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
          data-index="type"
          :title="$t('applications.applications.table.type')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="status.summaryStatus"
          :title="$t('applications.applications.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: get(record, 'status.summaryStatus'),
                text: get(record, 'status.summaryStatus'),
                message: get(record, 'status.summaryStatusMessage'),
                transitioning: get(record, 'status.transitioning'),
                error: get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <!-- <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleEnabled(record)">
                <template #icon><icon-edit /></template>
                {{ $t('common.button.enabled') }}
              </a-link>
              <a-link type="text" size="small" @click="handleDisabled(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                {{ $t('common.button.disabled') }}
              </a-link>
            </a-space>
          </template>
        </a-table-column> -->
      </template>
    </a-table>
    <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="
        queryParams.perPage === 10 || queryParams.perPage === -1
      "
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { get } from 'lodash';
  import { onMounted, ref, reactive, inject, watch } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { InstanceResource } from '../../config/interface';
  import { queryApplicationResource } from '../../api';

  const instanceId = inject('instanceId', ref(''));
  const total = ref(0);
  const loading = ref(false);
  const queryParams = reactive({
    page: 1,
    perPage: -1
  });
  const dataList = ref<InstanceResource[]>([]);
  const handleEnabled = (row) => {
    console.log(row);
  };
  const handleDisabled = (row) => {
    console.log(row);
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params = {
        ...queryParams,
        instanceID: instanceId.value
      };
      const { data } = await queryApplicationResource(params);
      dataList.value = data?.items || [];
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
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    handleFilter();
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
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>
