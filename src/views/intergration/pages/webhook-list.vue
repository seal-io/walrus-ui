<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span v-if="type === 'webhook'">{{
            $t('intergration.webhook.list.title')
          }}</span>
          <span v-if="type === 'smtp'">{{
            $t('intergration.email.list.title')
          }}</span>
        </div>
        <a-space>
          <a-button type="primary" @click="handleCreate">{{
            $t('intergration.button.add', {
              service: $t(get(serviceMap, `${type}`)),
            })
          }}</a-button>
          <a-button
            type="primary"
            status="warning"
            :disabled="!selectedKeys.length"
            @click="handleDelete"
            >{{ $t('common.button.delete') }}</a-button
          >
        </a-space>
      </div>
      <a-card class="general-card q-s-w-card">
        <a-space direction="vertical" :size="20" fill>
          <a-table
            column-resizable
            :loading="loading"
            :data="dataList"
            :pagination="false"
            row-key="id"
            :row-selection="rowSelection"
            @selection-change="handleSelectChange"
          >
            <template #columns>
              <a-table-column
                :width="220"
                :title="$t('intergration.webhook.name')"
                data-index="name"
              >
                <template #cell="{ record }">
                  <span>{{ record.name }}</span>
                </template>
              </a-table-column>
              <a-table-column
                v-if="type === 'webhook'"
                :title="$t('intergration.webhook.url')"
              >
                <template #cell="{ record }">
                  <span>{{ record?.webhook?.url }}</span>
                </template>
              </a-table-column>
              <a-table-column
                v-if="type === 'smtp'"
                :title="$t('intergration.email.ip')"
              >
                <template #cell="{ record }">
                  <span>{{ record?.smtp?.host }}</span>
                </template>
              </a-table-column>
              <a-table-column
                v-if="type === 'smtp'"
                :title="$t('intergration.email.port')"
              >
                <template #cell="{ record }">
                  <span>{{ record?.smtp?.port }}</span>
                </template>
              </a-table-column>
              <a-table-column
                v-if="type === 'smtp'"
                :title="$t('intergration.email.sender')"
              >
                <template #cell="{ record }">
                  <span>{{ record?.smtp?.senderAddress }}</span>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('common.table.operation')"
                :width="180"
                align="center"
              >
                <template #cell="{ record }">
                  <a-button type="text" @click="handleEdit(record)">{{
                    $t('common.button.edit')
                  }}</a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
          <a-pagination
            size="small"
            hide-on-single-page
            :total="total"
            :page-size="pagination.perPage"
            :current="pagination.page"
            show-total
            show-page-size
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </a-space>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { get, map } from 'lodash';
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { pushServiceList, imgItem, serviceMap } from '../config';
  import {
    serverItems,
    tableListParams,
    queryNoticeList,
    deleteNoticeItem,
  } from '../api/webhook';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { id } = route.query;
  const { type } = route.params;
  const total = ref<number>(0);
  const dataList = ref<serverItems[]>([]);
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);
  const basePagination: Pagination = {
    page: 1,
    perPage: 10,
  };

  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    ...basePagination,
    type: type as string,
  });
  const headerTitleMap = {
    webhook: 'intergration.webhook.url',
    smtp: 'intergration.email.ip',
  };

  const notifierItemInfo: any = computed(() => {
    const list: Array<imgItem> = [].concat(pushServiceList as never[]);
    const data = list.find((item) => {
      return item.field && item.field === type;
    });
    return data;
  });
  const fetchData = async (params: tableListParams = { ...pagination }) => {
    try {
      console.log('params:', params);
      setLoading(true);
      const { data } = await queryNoticeList(params);
      console.log('data:', data);
      dataList.value = data.items || [];
      total.value = data.pagination.total || 0;
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handlePageChange = (page: number) => {
    pagination.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1;
    pagination.perPage = pageSize;
    handleFilter();
  };
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log({ list });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val,
        };
      });
      await deleteNoticeItem(ids);
      loading.value = false;
      Message.success(t('common.message.success'));
      pagination.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleEdit = (row: serverItems) => {
    console.log('edit', row.id);
    if (!notifierItemInfo.value || !notifierItemInfo.value.name) return;
    router.push({
      name: notifierItemInfo.value.name,
      query: {
        id: row.id,
      },
    });
  };
  const handleCreate = () => {
    console.log('create');
    if (!notifierItemInfo.value || !notifierItemInfo.value.name) return;
    router.push({
      name: notifierItemInfo.value.name,
    });
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .container {
    margin-top: 0;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      padding-bottom: 15px;
      font-weight: 500;
      font-size: 18px;
      text-transform: capitalize;
      // border-bottom: 1px solid #fff;
    }

    :deep(.arco-icon-copy) {
      margin-left: 6px;
      font-size: 16px;
    }

    :deep(.arco-transfer) {
      width: 100%;
    }

    :deep(.arco-transfer-view) {
      width: 50%;
    }

    :deep(.arco-card-body) {
      padding: 20px !important;
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
    }

    .general-card {
      .cap-title {
        text-transform: capitalize;
      }

      .label {
        margin-bottom: 15px;
        padding-top: 20px;
        padding-bottom: 12px;
        text-transform: capitalize;
        border-bottom: 1px solid var(--seal-border-gray);
      }

      .btn-wrap {
        width: 200px;
        margin: 0 auto;
        margin-top: 40px;
      }
    }
  }
</style>
