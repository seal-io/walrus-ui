<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          {{ title }}
        </div>
        <a-space>
          <a-button type="primary" @click="handleCreate">{{
            $t('intergration.button.add', {
              service: adds,
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
            :columns="columns"
            :data="dataList"
            :pagination="false"
            row-key="id"
            :row-selection="rowSelection"
            @selection-change="handleSelectChange"
          >
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
  import axios from 'axios';
  import qs from 'query-string';
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, computed, onMounted, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { serverItems, tableListParams } from '../api/webhook';

  interface ColumnItem {
    dataIndex: string;
    title: string;
  }
  const props = defineProps({
    api: {
      type: String,
      default() {
        return '';
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    adds: {
      type: String,
      default() {
        return '';
      },
    },
    listItem: {
      type: Array,
      default() {
        return [];
      },
    },
    columns: {
      type: Array as PropType<ColumnItem[]>,
      default() {
        return [];
      },
    },
    query: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const emits = defineEmits(['edit', 'create']);
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
    ...props.query,
  });

  const queryDataList = (params) => {
    return axios.get(`/${props.api}`, {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      },
    });
  };
  const deleteData = (data) => {
    return axios.delete(`/${props.api}`, { data });
  };

  const fetchData = async (params = { ...pagination }) => {
    if (!props.api) return;
    try {
      setLoading(true);
      const { data } = await queryDataList(params);
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
      await deleteData(ids);
      loading.value = false;
      Message.success(t('common.message.success'));
      pagination.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleEdit = (row) => {
    console.log('edit', row.id);
    emits('edit', row);
  };
  const handleCreate = () => {
    console.log('create');
    emits('create');
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
