<template>
  <div class="container">
    <a-space class="filter-wrap">
      <a-space>
        <a-select
          v-if="activeTab === 'group'"
          v-model="query.builtin"
          :placeholder="$t('license.tablist.holder')"
          allow-clear
          style="width: 150px"
          @change="handleBuiltInChange"
        >
          <a-option
            v-for="item in builtInList"
            :key="item.value"
            :value="item.value"
            :label="$t(item.label)"
          ></a-option>
        </a-select>
        <a-select
          v-if="activeTab === 'license'"
          v-model="query.tags"
          multiple
          :max-tag-count="1"
          :placeholder="$t('license.filter.tags')"
          allow-clear
          style="width: 260px"
          @change="handlerSearch"
        >
          <a-option
            v-for="item in tagNameList"
            :key="item"
            :value="item"
            :label="item"
          ></a-option>
        </a-select>
        <a-input
          v-model="query.query"
          allow-clear
          :placeholder="
            activeTab === 'group'
              ? $t('license.modal.name.tag')
              : $t('license.modal.name.holder')
          "
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
        <!-- <a-popconfirm
          position="br"
          arrow-class="page-pop-arrow"
          content-class="pg-pop-content"
          @popup-visible-change="handleVisibleChange"
        >
          <template #content>
            <a-space :size="15">
              <a-tag @click="handleAddOne">{{
                $t('license.button.add.one')
              }}</a-tag>
              <a-tag @click="handleAddLicense">{{
                $t('license.button.add.group')
              }}</a-tag>
            </a-space>
          </template>
          <a-button type="primary"
            >{{ $t('license.button.add')
            }}<icon-down :class="{ open: popVisible }"
          /></a-button>
        </a-popconfirm> -->
        <a-button type="primary" @click="handleAddLicense">{{
          $t('license.button.add.group')
        }}</a-button>
        <a-button
          v-show="activeTab === 'group'"
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </a-space>
    </a-space>
    <a-card class="general-card q-s-w-card">
      <a-tabs
        hide-content
        default-active-key="group"
        :active-key="activeTab"
        type="capsule"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in tabList"
          :key="item.value"
          :title="$t(item.label)"
        ></a-tab-pane>
      </a-tabs>
      <a-space direction="vertical" :size="20" fill>
        <a-table
          column-resizable
          :loading="loading"
          :data="dataList"
          :pagination="false"
          row-key="id"
          :row-selection="rowSelection"
          @sorter-change="handleSortChange"
          @selection-change="handleSelectChange"
        >
          <template #columns>
            <!-- <a-table-column
              v-if="activeTab === 'license'"
              title="ID"
              data-index="id"
            >
            </a-table-column> -->
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              :title="$t('license.modal.name')"
              data-index="name"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: '',
                sorter: true,
                sortOrder: sortOrder,
              }"
            >
              <template #cell="{ record }">
                <span>{{ record.name }}</span>
                <a-tag
                  v-if="record.deprecated"
                  style="margin-left: 4px; color: #f77234"
                  color="rgba(247, 114, 52,.2)"
                  size="small"
                  >{{ $t('license.tablist.deprecated') }}</a-tag
                >
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :body-cell-style="{ overflow: 'hidden' }"
              :title="$t('license.table.description')"
              data-index="description"
            >
              <!-- <template #cell="{ record }">
                <a-tooltip :content="record.description">
                  <span class="ov-text">{{ record.description }}</span>
                </a-tooltip>
              </template> -->
            </a-table-column>
            <a-table-column
              v-if="activeTab === 'license'"
              :title="$t('license.tablist.group')"
            >
              <template #cell="{ record }">
                <AutoTip :tooltip-props="{ content: join(record.tags, ',') }">
                  <span>
                    <a-tag
                      v-for="(val, index) in record.tags"
                      :key="index"
                      color="#0DA5AA"
                      size="small"
                      style="margin-right: 4px; padding: 0 4px"
                      >{{ val }}</a-tag
                    >
                  </span>
                </AutoTip>
              </template>
            </a-table-column>
            <!-- <a-table-column
              v-if="activeTab === 'license'"
              :title="$t('license.tablist.enable')"
              :width="80"
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
              v-if="activeTab === 'license'"
              ellipsis
              tooltip
              :cell-style="{ minWidth: '60px' }"
              :title="$t('license.modal.link')"
              data-index="references"
            >
              <template #cell="{ record }">
                <span class="link-wrap">
                  <a-link :href="get(record, 'references.0')" target="_blank">{{
                    get(record, 'references.0')
                  }}</a-link>
                </span>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t('logs.list.operate')"
              :width="160"
              align="center"
            >
              <template #cell="{ record }">
                <a-button
                  v-if="activeTab === 'group'"
                  type="text"
                  @click="handleEdit(record)"
                  >{{ $t('common.button.edit') }}</a-button
                >
                <a-button
                  v-if="activeTab === 'license'"
                  type="text"
                  @click="handleEdit(record)"
                  >{{ $t('common.button.detail') }}</a-button
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
    <addOne
      v-model:show="show"
      :data-info="licenseData"
      :action="addStatus"
      @licenseSave="handleSaveLicense"
    ></addOne>
  </div>
</template>

<script lang="ts" setup>
  import { deleteModal } from '@/utils/monitor';
  import { BaseType, Pagination } from '@/types/global';
  import { pickBy, map, some, omit, get, join, cloneDeep } from 'lodash';
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Modal, Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { UseSortDirection } from '@/utils/common';
  import {
    licenseGroupRow,
    queryLicenseGroups,
    deleteLicense,
    deleteGroups,
    licenseGroupParams,
    queryLicenseList,
    queryLicenseInfo,
    queryTagList,
    updateLicense,
  } from '../api';
  import addOne from '../components/add-one.vue';
  import { tabList, builtInList } from '../config';

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: 'name',
    defaultOrder: 'ascend',
  });
  const show = ref(false);
  const popVisible = ref(false);
  const tag = get(route.query, 'tag') || 'license';
  const addStatus = ref('create');
  const activeTab = ref<string>(tag as string); // group, license
  const dataList = ref<licenseGroupRow[]>([]);
  const tagNameList = ref<string[]>([]);
  const licenseData = reactive({
    name: '',
    description: '',
    id: '',
    link: '',
  });
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: false,
    selectedRowKeys: [] as string[],
  });
  const query = reactive({
    query: '',
    builtin: '',
    tags: '',
    sort: 'name',
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
  const getLicenseGroups = async () => {
    const resParams = {
      ...pagination,
      ...query,
      tags: '',
    };
    const params: any = pickBy(resParams, (val) => val !== '');
    try {
      console.log('params:', params);
      setLoading(true);
      const { data } = await queryLicenseGroups(params);
      dataList.value = map(data.items || [], (o) => {
        o.disabled = o.builtin;
        return o;
      });
      rowSelection.showCheckedAll = some(dataList.value, (s) => !s.builtin);
      total.value = data?.pagination?.total || 0;
      setLoading(false);
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getLicenseList = async () => {
    const resParams = {
      ...pagination,
      ...query,
    };
    const params: any = omit(
      pickBy(resParams, (val) => val),
      ['name']
    );
    try {
      console.log('params:', params);
      setLoading(true);
      if (params?.tags?.length) {
        params.tags = join(params.tags, ',');
      }
      const { data } = await queryLicenseList(params);
      dataList.value = map(data.items || [], (o) => {
        o.disabled = o.builtin;
        return o;
      });
      rowSelection.showCheckedAll = some(dataList.value, (s) => !s.builtin);
      total.value = data?.pagination?.total || 0;
      setLoading(false);
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getTagNameList = async () => {
    const { data } = await queryTagList();
    tagNameList.value = [].concat(data || []);
  };
  const fetchData = async () => {
    if (activeTab.value === 'group') {
      getLicenseGroups();
    } else if (activeTab.value === 'license') {
      getLicenseList();
    }
  };

  const handleFilter = () => {
    fetchData();
  };
  const handleBuiltInChange = () => {
    pagination.page = 1;
    handleFilter();
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
    query.tags = '';
    query.query = '';
    query.builtin = '';
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    query.sort = sort.value;
    pagination.page = 1;
    fetchData();
  };

  const handleDeleteLicense = async () => {
    const ids = map(selectedKeys.value, (val) => {
      return {
        id: val,
      };
    });
    if (activeTab.value === 'group') {
      await deleteGroups(ids);
    } else if (activeTab.value === 'license') {
      await deleteLicense(ids);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedKeys.value.length) return;
    try {
      loading.value = true;
      await handleDeleteLicense();
      loading.value = false;
      Message.success(t('common.message.success'));
      pagination.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
      console.log(selectedKeys.value);
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const getLicenseInfo = async (id) => {
    const { data } = await queryLicenseInfo(id);
    Object.assign(licenseData, data);
    addStatus.value = 'edit';
    setTimeout(() => {
      show.value = true;
    }, 50);
  };
  // eidt
  const handleEdit = (row: any) => {
    if (activeTab.value === 'license') {
      getLicenseInfo(row.id);
    } else {
      router.push({
        name: 'tagEdit',
        query: {
          groupId: row.id,
          tagName: row.name,
          builtin: row.builtin ? '1' : '0',
        },
      });
    }
  };
  const handleEnableChange = async (value, row, index) => {
    const rowData: any = cloneDeep(row);
    rowData.enabled = value;
    await updateLicense(rowData);
    dataList.value.splice(index, 1, rowData);
    // Message.success(t('common.message.success'));
  };
  const handleAddLicense = () => {
    router.push({
      name: 'tagEdit',
      query: {
        action: '1',
      },
    });
  };
  const handleAddOne = () => {
    addStatus.value = 'create';
    setTimeout(() => {
      show.value = true;
    }, 50);
  };
  const handleSaveLicense = () => {
    Object.assign(licenseData, {
      name: '',
      description: '',
      id: '',
      link: '',
      builtIn: false,
    });
    activeTab.value = 'license';
    pagination.page = 1;
    handleFilter();
  };
  const handleTabChange = (key) => {
    router.replace(`?tag=${key}`);
    activeTab.value = key;
    query.query = '';
    query.builtin = '';
    query.tags = '';
    pagination.page = 1;
    fetchData();
  };
  onMounted(() => {
    getTagNameList();
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
      padding: 16px 20px 20px 20px;
    }

    .ov-text {
      display: inline-block;
      max-width: 500px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .link-wrap {
      display: inline-block;
      max-width: max-content;
      overflow: hidden;
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
