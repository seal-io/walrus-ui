<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <span>{{ $t('intergration.policy.title', { repo: repo }) }}</span>
        <a-space>
          <a-button type="primary" @click="handleCreate">{{
            $t('intergration.button.create')
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
                :width="160"
                :title="$t('intergration.repoPolicy.name')"
                data-index="name"
              >
                <template #cell="{ record }">
                  <span>{{ record.name }}</span>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('intergration.repoPolicy.proxyUrl')"
                data-index="proxyUrl"
              >
                <template #cell="{ record }">
                  <span>{{ record.proxyUrl }}</span
                  ><SCopy :content="record.proxyUrl" />
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('intergration.repoPolicy.upstreamUrl')"
                data-index="upstreamUrl"
              ></a-table-column>
              <a-table-column
                :title="$t('common.table.operation')"
                align="center"
              >
                <template #cell="{ record }">
                  <a-button type="text" @click="handleEdit(record)">{{
                    $t('common.button.edit')
                  }}</a-button>
                  <!-- <a-button
                    type="text"
                    status="danger"
                    @click="handleDelete(record)"
                    >{{ $t('common.button.delete') }}</a-button
                  > -->
                  <a-button
                    type="text"
                    @click="handleShowInstruction(record)"
                    >{{ $t('intergration.proxy.instruction') }}</a-button
                  >
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
        <a-drawer
          v-model:visible="visible"
          :width="550"
          ok-text="Close"
          unmount-on-close
          @close="handleOk"
        >
          <template #title>
            <div style="font-size: 18px; text-transform: capitalize"
              >{{ type }} {{ $t('intergration.proxy.title.instruction') }}</div
            >
          </template>
          <template #footer>
            <div>
              <a-button @click="handleOk">{{
                $t('common.button.close')
              }}</a-button>
            </div>
          </template>
          <div>
            <maven-guide
              v-if="type === 'maven'"
              :proxy-name="rowInfo.name"
              :upstream-url="rowInfo.upstreamUrl"
              :proxy-url="rowInfo.proxyUrl"
            ></maven-guide>
            <docker-guide
              v-if="type === 'docker'"
              :proxy-name="rowInfo.name"
              :upstream-url="rowInfo.upstreamUrl"
              :proxy-url="rowInfo.proxyUrl"
            ></docker-guide>
          </div>
        </a-drawer>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { map } from 'lodash';
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import SCopy from '@/components/copy/index.vue';
  import {
    PolicyTableRow,
    PolicyTableParams,
    queryPolicyDataList,
  } from '../api/policy-list';
  import { deleteProxyItem } from '../api/proxy-config';
  import MavenGuide from '../components/maven-guide.vue';
  import DockerGuide from '../components/docker-guide.vue';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const repo = route.params.repo as string;
  const { type, id } = route.query;
  const total = ref<number>(0);
  const dataList = ref<PolicyTableRow[]>([]);
  const visible = ref<boolean>(false);
  const rowInfo = ref<any>({});
  const basePagination: Pagination = {
    page: 1,
    perPage: 10,
  };

  const { loading, setLoading } = useLoading(true);
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);
  const pagination = reactive({
    ...basePagination,
    type: type as string,
  });

  const fetchData = async (params: PolicyTableParams = { ...pagination }) => {
    try {
      console.log('params:', params);
      setLoading(true);
      const { data } = await queryPolicyDataList(params);
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
  const handleShowInstruction = (row: any) => {
    visible.value = true;
    rowInfo.value = row;
  };
  const handleOk = () => {
    visible.value = false;
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
      await deleteProxyItem(ids);
      loading.value = false;
      Message.success(t('common.message.success'));
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      pagination.page = 1;
      handleFilter();
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleEdit = (row: PolicyTableRow) => {
    console.log('edit', row.id);
    router.push({
      name: 'proxyConfig',
      params: {
        repo,
      },
      query: {
        id: row.id,
      },
    });
  };
  const handleCreate = () => {
    console.log('create');
    router.push({
      name: 'proxyConfig',
      params: {
        repo,
      },
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
