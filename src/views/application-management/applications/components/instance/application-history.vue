<template>
  <div class="history-wrap">
    <a-table
      :loading="loading"
      column-resizable
      style="margin-bottom: 10px"
      :bordered="false"
      :data="dataList"
      :pagination="false"
    >
      <template #columns>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="instance.id"
          :title="$t('applications.applications.history.version')"
        >
        </a-table-column> -->
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="createTime"
          :title="$t('applications.applications.history.deploymentTime')"
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
          data-index="duration"
          :title="$t('dashboard.table.duration')"
        >
          <template #cell="{ record }">
            <span>{{ setDurationValue(record.duration) }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="status"
          :title="$t('dashboard.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :zoom="10"
              :status="{
                status: record.status,
                text: record.status,
                message: '',
                transitioning: record.status === 'Running',
                error: record.status === 'Failed'
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="operator"
          :title="$t('applications.applications.history.operator')"
        >
        </a-table-column> -->
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <!-- <a-link type="text" size="small" @click="handleClone(record)">
                <template #icon><icon-edit /></template>
                {{ $t('applications.applications.history.clone') }}
              </a-link>
              <a-link type="text" size="small" @click="handleRollback(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                {{ $t('applications.applications.history.rollback') }}
              </a-link> -->
              <a-tooltip :content="$t('common.button.delete')">
                <a-link type="text" size="small" @click="handleDelete(record)">
                  <template #icon
                    ><icon-delete style="font-size: 16px"
                  /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.logs')">
                <a-link
                  type="text"
                  size="small"
                  @click="handleViewDetail(record)"
                >
                  <template #icon
                    ><icon-font type="icon-rizhi" style="font-size: 16px"
                  /></template>
                </a-link>
              </a-tooltip>
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
    <revisionDetailVue
      v-model:show="showDetailModal"
      :data-info="revisionData"
      :revision-id="revisionDetailId"
      :initial-status="initialStatus"
    ></revisionDetailVue>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import {
    map,
    get,
    find,
    each,
    findIndex,
    cloneDeep,
    concat,
    filter
  } from 'lodash';
  import {
    onMounted,
    ref,
    reactive,
    inject,
    watch,
    nextTick,
    onBeforeUnmount
  } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { deleteModal } from '@/utils/monitor';
  import { createWebsocketInstance } from '@/hooks/use-websocket';
  import { HistoryData } from '../../config/interface';
  import { setDurationValue, websocketEventType } from '../../config';
  import deployLogs from '../deploy-logs.vue';
  import revisionDetailVue from '../revision-detail.vue';
  import {
    queryApplicationRevisions,
    deleteApplicationRevisions
  } from '../../api';

  const instanceId = inject('instanceId', ref(''));
  const revisionId = ref('');
  const revisionDetailId = ref('');
  const revisionData = ref({});
  const total = ref(0);
  const loading = ref(false);
  const showDetailModal = ref(false);
  const ids = ref<{ id: string }[]>([]);
  const initialStatus = ref('');
  const websocketRevisions = ref<any>(null);
  const showLogs = ref(false);
  const queryParams = reactive({
    page: 1,
    perPage: 10
  });
  const dataList = ref<HistoryData[]>([]);
  const handleClone = (row) => {
    console.log(row);
  };
  const handleRollback = (row) => {
    console.log(row);
  };

  const fetchData = async () => {
    if (!instanceId.value) return;
    try {
      loading.value = true;
      const { data } = await queryApplicationRevisions({
        ...queryParams,
        instanceID: instanceId.value
      });
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
  const handleDeleteConfirm = async () => {
    try {
      const params = map(ids.value, (val) => {
        return {
          id: val.id
        };
      });
      await deleteApplicationRevisions(params);
      queryParams.page = 1;
      handleFilter();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (row) => {
    ids.value = [{ id: row.id }];
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleViewDetail = (row) => {
    revisionDetailId.value = row.id;
    revisionData.value = row;
    initialStatus.value = row.status;
    setTimeout(() => {
      showDetailModal.value = true;
    }, 100);
  };
  const updateRevisions = (data) => {
    if (data?.type !== websocketEventType.update) return;
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.instance?.id === instanceId.value
    );
    const openRevisionData = find(
      collections,
      (item) => item.id === get(revisionData.value, 'id')
    );
    if (openRevisionData) {
      revisionData.value = openRevisionData;
    }
    each(collections, (item) => {
      const updateIndex = findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      } else {
        dataList.value = concat(cloneDeep(item), dataList.value);
      }
    });
  };
  const createInstanceListWebsocket = () => {
    try {
      if (websocketRevisions.value) return;
      websocketRevisions.value = createWebsocketInstance({
        url: `/application-revisions`,
        onmessage: updateRevisions
      });
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => instanceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
      nextTick(() => {
        createInstanceListWebsocket();
      });
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    console.log('wss unmounted');
    websocketRevisions.value?.close?.();
  });
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>
