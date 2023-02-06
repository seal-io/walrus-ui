<template>
  <div class="container">
    <a-space class="filter-wrap" fill>
      <a-space>
        <!-- <a-select
          v-model="query.severity"
          :style="{ width: '200px' }"
          :placeholder="$t('policy.table.riskLevel')"
          allow-clear
          @change="handleTabChange"
        >
          <a-option
            v-for="item in riskLevelList"
            :key="item.value"
            :value="item.value"
            >{{ $t(item.label) }}</a-option
          >
        </a-select> -->
        <!-- <a-tabs
          type="text"
          size="small"
          :active-key="query.severity"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="item in riskLevelList"
            :key="item.value"
            :title="$t(item.label)"
          >
          </a-tab-pane>
        </a-tabs> -->
        <a-input
          v-model="query.query"
          allow-clear
          :placeholder="$t('policy.holder.policyName')"
          style="width: 300px"
          @clear="handlerSearch"
          @change="handlerSearch"
          @press-enter="handlerSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <!-- <a-button
          type="primary"
          style="margin-left: 15px"
          @click="handleReset"
          >{{ $t('common.button.reset') }}</a-button
        > -->
      </a-space>
      <a-space>
        <a-button
          v-show="category !== 'workflow'"
          type="primary"
          @click="handleAddPolicy"
          >{{ $t('policy.button.add') }}</a-button
        >
        <a-button
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </a-space>
    </a-space>
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
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              :title="$t('policy.detail.edit.policyName')"
              data-index="name"
            >
              <template #cell="{ record }">
                <span>{{ record.name }}</span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              :title="$t('policy.table.checkPolicy')"
              data-index="checkPolicy"
            >
              <template #cell="{ record }">
                <span>
                  <span v-if="category === 'configuration'"
                    >{{ $t('policy.action.repo.config') }}
                  </span>
                  <span v-else
                    >{{ setLabel(`policy.${record.type}`, record.type) }}
                  </span>
                </span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              data-index="description"
              :title="$t('license.modal.description')"
            >
              <template #cell="{ record }">
                <span v-html="setDesciption(scaMap, record)"></span>
              </template>
            </a-table-column>
            <a-table-column
              :width="80"
              :title="$t('policy.table.switch')"
              data-index="enabled"
              :cell-style="{ 'line-height': 1 }"
            >
              <template #cell="{ record, rowIndex }">
                <a-switch
                  :model-value="record.enabled"
                  size="small"
                  @change="(val) => handleEnableChange(val, record, rowIndex)"
                ></a-switch>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t('policy.table.operation')"
              :width="100"
              :cell-style="{
                'text-align': 'center',
                'width': '100%',
                'display': 'inline-block',
              }"
              align="center"
            >
              <template #cell="{ record }">
                <a-space align="start">
                  <a-button type="text" @click="handleEdit(record)">{{
                    $t('common.button.edit')
                  }}</a-button>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
        <a-pagination
          size="small"
          :total="total"
          :page-size="pagination.perPage"
          :current="pagination.page"
          show-total
          show-page-size
          :hide-on-single-page="pagination.perPage === 10"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { cloneDeep, get, lowerFirst, map, some } from 'lodash';
  import pickBy from 'lodash/pickBy';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useLocaleKey } from '@/utils/func';
  import {
    updatePolicy,
    deletePolicy,
    PolicyTableRow,
    PolicyTableParams,
    queryPolicyDataList,
  } from '@/api/policy';
  import { Modal, Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { riskLevelList, scaMap } from '../config';
  import { usePluginPolicy } from '../hooks/use-plugin-policy';

  const { getPluginPolicySchemas, categoriesList } = usePluginPolicy();
  const router = useRouter();
  const { t } = useI18n();
  const { localeKey } = useLocaleKey();
  const props = defineProps({
    category: {
      type: [String, Number],
      default() {
        return 1;
      },
    },
  });
  let timer: any = null;
  const dataList = ref<PolicyTableRow[]>([]);
  const total = ref<number>(0);
  const basePagination: Pagination = {
    page: 1,
    perPage: 10,
  };
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: false,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);
  const query = reactive({
    severity: '',
    query: '',
    category: props.category === 'whiteList' ? '' : props.category,
    actions: props.category === 'whiteList' ? 'permit' : 'warn,block',
  });
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    ...basePagination,
  });
  const handleEnableChange = async (value, row, index) => {
    const rowData: any = cloneDeep(row);
    rowData.enabled = value;
    await updatePolicy(rowData);
    dataList.value.splice(index, 1, rowData);
    // Message.success(t('common.message.success'));
  };
  const handleEdit = (row) => {
    router.push({
      name: 'policyEdit',
      params: {
        category: props.category,
      },
      query: {
        policyId: row.id,
      },
    });
  };
  const getListLabel = (value, list) => {
    const data = list.find((item) => item.value === value);
    return data ? data.label : '';
  };
  const setLabel = (text, value) => {
    const locale = `${lowerFirst(text)}`;
    console.log('locale===', localeKey(locale), locale);
    return localeKey(locale) ? t(locale) : value;
  };
  const setDesciption = (obj, record) => {
    const locale = get(obj, record.code);
    if (locale) return t(locale);
    return record.description;
  };
  const fetchData = async (
    params: PolicyTableParams = { ...pagination, ...query }
  ) => {
    try {
      console.log('params:', params);
      setLoading(true);
      params = pickBy(
        params,
        (val: any) => val || val?.length
      ) as PolicyTableParams;
      const { data } = await queryPolicyDataList(params);
      console.log('data==', data);
      dataList.value = map(data.items || [], (o) => {
        o.disabled = o.builtIn;
        return o;
      });

      rowSelection.showCheckedAll = some(dataList.value, (s) => !s.builtIn);
      total.value = data?.pagination?.total || 0;
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
  const handleTabChange = (val: any) => {
    query.severity = val;
    pagination.page = 1;
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
      await deletePolicy(ids);
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
  const handleDelete = async (row: any) => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handlerSearch = () => {
    console.log('search');
    pagination.page = 1;
    handleFilter();
  };
  const handleReset = () => {
    query.severity = '';
    query.query = '';
    pagination.page = 1;
    handleFilter();
  };
  const handleQueryInput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handlerSearch();
    }, 400);
  };

  const handleToDetail = (row: any) => {
    router.push({
      name: 'policyDetail',
      query: {
        id: row.id,
      },
    });
  };
  const handleAddPolicy = () => {
    router.push({
      name: 'policyEdit',
      params: {
        category: props.category,
      },
    });
  };
  onMounted(async () => {
    await getPluginPolicySchemas();
    fetchData();
  });
</script>

<style lang="less" scoped>
  .container {
    min-width: 550px;

    :deep(.arco-card-body) {
      padding: 20px;
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
    }

    .ov-text {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }

    .ver-text {
      display: inline-block;
      vertical-align: middle;
    }

    :deep(.arco-tabs-content) {
      display: none;
    }

    :deep(.arco-input-wrapper) {
      background: #fff;

      .acro-input {
        background: #fff;
      }
    }

    :deep(.arco-tabs-nav-tab-list) {
      background: #fff;
    }

    :deep(.arco-select) {
      background: #fff;
    }

    .filter-wrap {
      display: flex;
      justify-content: space-between;
      // background: #fff;
      margin-bottom: 12px;
    }
  }
</style>
