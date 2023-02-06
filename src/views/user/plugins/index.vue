<template>
  <div class="container">
    <a-space class="filter-wrap">
      <a-space>
        <a-select
          v-model="query.builtin"
          :placeholder="$t('license.tablist.holder')"
          allow-clear
          style="width: 150px"
          @change="handlerSearch"
        >
          <a-option
            v-for="item in builtInList"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          ></a-option>
        </a-select>
        <a-select
          v-model="query.status"
          :placeholder="$t('plugin.table.status')"
          allow-clear
          style="width: 150px"
          @change="handlerSearch"
        >
          <a-option
            v-for="item in statusList"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          ></a-option>
        </a-select>
        <a-input
          v-model="query.query"
          allow-clear
          :placeholder="$t('plugin.table.filter.name')"
          style="width: 300px"
          @clear="handlerSearch"
          @change="handlerSearch"
          @press-enter="handlerSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-button
          type="primary"
          style="margin-left: 15px"
          @click="handleReset"
          >{{ $t('common.button.reset') }}</a-button
        >
      </a-space>
      <a-space>
        <a-button type="primary" @click="handleAddPlugin">{{
          $t('plugin.button.add')
        }}</a-button>
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
            <a-table-column :title="$t('plugin.table.name')" data-index="name">
            </a-table-column>
            <a-table-column
              :title="$t('plugin.table.description')"
              data-index="description"
            >
              <template #cell="{ record }">
                <a-tooltip :content="record.description">
                  <span class="ov-text">{{ record.description }}</span>
                </a-tooltip>
              </template>
            </a-table-column>
            <!-- <a-table-column
              :title="$t('plugin.table.enable')"
              data-index="enabled"
            >
              <template #cell="{ record, rowIndex }">
                <a-switch
                  :model-value="record.enabled"
                  size="small"
                  @change="(val) => handleEnableChange(val, record, rowIndex)"
                ></a-switch>
              </template>
            </a-table-column> -->
            <a-table-column
              :title="$t('plugin.table.status')"
              data-index="status"
            >
              <template #cell="{ record }">
                <a-tag :color="statusColorMap[record.status]" size="small">{{
                  $t(getListLabel(record.status, statusList))
                }}</a-tag
                ><a-tooltip
                  v-if="record.status === 'error'"
                  :content="record.statusMessage"
                >
                  <icon-question-circle
                    style="
                      margin-left: 4px;
                      color: #a9aeb8;
                      vertical-align: middle;
                    "
                  />
                </a-tooltip>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t('plugin.table.operation')"
              :width="160"
              align="center"
            >
              <template #cell="{ record }">
                <a-button
                  v-if="!record.builtIn"
                  type="text"
                  @click="handleEdit(record)"
                  >{{ $t('common.button.edit') }}</a-button
                >
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
    <editForm
      v-model:show="show"
      :data-info="pluginData"
      :action="addStatus"
      @licenseSave="handleSavePlugin"
    ></editForm>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, pickBy, map, some, omit, find } from 'lodash';
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { getListLabel } from '@/utils/func';
  import { Modal, Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { builtInList } from '@/views/license/config';
  import {
    TableListRow,
    deletePlugins,
    ListParams,
    queryPluginsList,
    updatePlugins,
  } from './api';
  import { statusList } from './config';
  import editForm from './components/edit-form.vue';

  const { t } = useI18n();
  const router = useRouter();
  const statusColorMap = {
    error: '#f53f3f',
    ready: '#0fc6c2',
    initializing: '#168cff',
  };
  const show = ref(false);
  const popVisible = ref(false);
  const addStatus = ref('create');
  const dataList = ref<TableListRow[]>([]);
  const pluginData = reactive({
    name: '',
    url: '',
    id: '',
    checksum: '',
  });
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: false,
    selectedRowKeys: [] as string[],
  });
  const query = reactive({
    query: '',
    builtin: '',
    status: '',
  });
  const selectedKeys = ref<BaseType[]>([]);
  const total = ref<number>(0);
  const basePagination: Pagination = {
    page: 1,
    perPage: 10,
  };

  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    ...basePagination,
  });
  const handleVisibleChange = (val) => {
    popVisible.value = val;
  };
  const fetchData = async () => {
    const resParams: ListParams = {
      ...pagination,
      ...query,
    };
    const params: any = pickBy(resParams, (val) => !!val);
    try {
      console.log('params:', params);
      setLoading(true);
      const { data } = await queryPluginsList(params);
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

  const handlerSearch = () => {
    console.log('search');
    pagination.page = 1;
    handleFilter();
  };
  const handleReset = () => {
    query.query = '';
    query.builtin = '';
    query.status = '';
    pagination.page = 1;
    handleFilter();
  };
  const handleSelectAll = (checked: boolean) => {
    console.log({ checked });
  };
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log('selectedKeys===', selectedKeys.value);
  };
  const handleFilterChange = (obj: any) => {
    const { dataIndex, filteredValues } = obj;
    console.log({ dataIndex, filteredValues });
  };
  const handleDeletePlugins = async () => {
    const ids = map(selectedKeys.value, (val) => {
      return {
        id: val,
      };
    });
    deletePlugins(ids);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedKeys.value.length) return;
    try {
      loading.value = true;
      await handleDeletePlugins();
      loading.value = false;
      Message.success(t('common.message.success'));
      pagination.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      setTimeout(() => {
        handleFilter();
      }, 100);
      console.log(selectedKeys.value);
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const queryPluginItemInfo = (id) => {
    const data = find(dataList.value, (item) => item.id === id);
    return data || {};
  };
  const getLicenseInfo = async (id) => {
    const data = queryPluginItemInfo(id);
    Object.assign(pluginData, data);
    addStatus.value = 'edit';
    setTimeout(() => {
      show.value = true;
    }, 50);
  };
  // eidt
  const handleEdit = (row: any) => {
    getLicenseInfo(row.id);
  };
  const handleAddPlugin = () => {
    addStatus.value = 'create';
    setTimeout(() => {
      show.value = true;
    }, 50);
  };
  const handleEnableChange = async (value, row, index) => {
    const rowData: any = cloneDeep(row);
    rowData.enabled = value;
    await updatePlugins(rowData);
    dataList.value.splice(index, 1, rowData);
    // Message.success(t('common.message.success'));
  };
  const handleSavePlugin = () => {
    Object.assign(pluginData, {
      name: '',
      description: '',
      id: '',
      url: '',
      checksum: '',
      enabled: true,
      builtIn: false,
    });
    pagination.page = 1;
    handleFilter();
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less">
  .page-pop-arrow {
    display: none;
  }

  .pg-pop-content {
    .arco-popconfirm-body {
      margin-bottom: 0;
    }

    .arco-tag {
      cursor: pointer;

      &:hover {
        color: var(--sealblue-6);
      }
    }

    .arco-link {
      padding: 4px 6px;
      // height: 24px;
      font-size: 12px;
      background-color: var(--color-fill-2);
    }

    .arco-popconfirm-footer {
      display: none;
    }

    .arco-popconfirm-icon {
      display: none !important;
    }
  }
</style>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-body) {
      padding: 20px 20px 20px 20px;
    }

    .ov-text {
      display: inline-block;
      max-width: 500px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    :deep(.arco-tabs-nav-type-capsule) {
      margin-bottom: 10px;

      .arco-tabs-nav-tab {
        justify-content: flex-start;
      }

      .arco-tabs-tab {
        font-weight: 500;
        line-height: 24px;
        background-color: #fff;

        &:hover {
          color: rgb(var(--primary-6));
        }

        &.arco-tabs-tab-active {
          background-color: transparent;
        }
      }
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
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
      border: 1px solid var(--color-neutral-3);
      border-bottom: none;
    }

    :deep(.arco-tabs-nav-type-capsule) {
      margin-bottom: -2px;
    }

    :deep(.arco-table-container) {
      border-top: none;
      border-radius: 0;
    }
    // :deep(.arco-tabs-nav-tab-list) {
    //   background: #fff;
    // }
    :deep(.arco-icon-down) {
      margin-left: 5px;
      transition: transform 0.3s;

      &.open {
        transform: rotate(-180deg);
        transition: transform 0.3s;
      }
    }

    .filter-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;

      :deep(.arco-select) {
        background-color: #fff;
      }
    }
  }
</style>
