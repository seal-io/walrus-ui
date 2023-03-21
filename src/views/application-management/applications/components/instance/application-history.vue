<template>
  <div class="history-wrap">
    <deployLogs
      v-if="showLogs"
      title="升级实例"
      :revision-id="revisionId"
      @close="handleCloseLogs"
    ></deployLogs>
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
            <span>{{ record.status }}</span>
            <a-link
              v-if="record.status === 'Running'"
              @click="handleShowDetail(record)"
              >{{ $t('common.button.detail') }}</a-link
            >
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
              <a-link type="text" size="small" @click="handleDelete(record)">
                <template #icon
                  ><icon-delete style="font-size: 16px"
                /></template>
                <!-- {{ $t('common.button.delete') }} -->
              </a-link>
              <a-link
                type="text"
                size="small"
                @click="handleViewDetail(record)"
              >
                <template #icon
                  ><icon-font type="icon-rizhi" style="font-size: 16px"
                /></template>
                <!-- {{ $t('common.button.delete') }} -->
              </a-link>
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
      :revision-id="revisionDetailId"
    ></revisionDetailVue>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { map, get, find } from 'lodash';
  import { onMounted, ref, reactive, inject, watch, InjectionKey } from 'vue';
  import { deleteModal } from '@/utils/monitor';
  import { HistoryData } from '../../config/interface';
  import { setDurationValue } from '../../config';
  import deployLogs from '../deploy-logs.vue';
  import revisionDetailVue from '../revision-detail.vue';
  import {
    queryApplicationRevisions,
    deleteApplicationRevisions
  } from '../../api';

  const props = defineProps({
    deployId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const instanceId = inject('instanceId', ref(''));
  const revisionId = ref('');
  const revisionDetailId = ref('');
  const total = ref(0);
  const loading = ref(false);
  const showDetailModal = ref(false);
  const ids = ref<{ id: string }[]>([]);
  const showLogs = ref(false);
  const hasLogs = ref(false);
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
  const handleCloseLogs = () => {
    showLogs.value = false;
  };
  const handleShowDetail = (row) => {
    revisionId.value = row.id;
    showLogs.value = true;
  };

  const fetchData = async () => {
    if (!instanceId) return;
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
    setTimeout(() => {
      showDetailModal.value = true;
    }, 100);
  };
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
  watch(
    () => props.deployId,
    (val) => {
      if (val) {
        revisionId.value = props.deployId;
        showLogs.value = true;
      } else {
        showLogs.value = false;
      }
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
