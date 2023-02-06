<template>
  <div class="container">
    <!-- <a-space class="filter-wrap" :size="15">
      <a-input
        v-model="query.events"
        :placeholder="$t('logs.list.events')"
        style="width: 200px"
        @press-enter="handlerSearch"
      >
      </a-input>
      <a-input
        v-model="query.source"
        :placeholder="$t('logs.list.source')"
        style="width: 200px"
        @press-enter="handlerSearch"
      >
      </a-input>
      <a-button type="primary" @click="handlerSearch">{{
        $t('common.button.search')
      }}</a-button>
      <a-button type="outline" @click="handlerReset">{{
        $t('common.button.reset')
      }}</a-button>
    </a-space> -->
    <a-card class="general-card q-s-w-card">
      <a-space direction="vertical" :size="20" fill>
        <a-table
          column-resizable
          :loading="loading"
          :data="dataList"
          :pagination="false"
          row-key="fullName"
          :row-selection="rowSelection"
          @selection-change="handleSelectChange"
        >
          <template #columns>
            <a-table-column
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
              :title="$t('projects.table.project')"
              data-index="name"
            >
              <template #title>
                <a-space>
                  <span>{{ $t('projects.table.project') }}</span>
                  <a-input-search
                    v-model="query.query"
                    allow-clear
                    @click.stop="() => {}"
                    @change="handlerSearch"
                  />
                </a-space>
              </template>
              <template #cell="{ record }">
                <a-tooltip
                  v-if="!get(record, 'repositoryConfiguration.isAdmin')"
                  position="tl"
                  :content="$t('resource.repo.permission.tips')"
                >
                  <IconFont
                    type="icon-a-userpermissions-fill"
                    class="seal-iconfont"
                  ></IconFont>
                </a-tooltip>
                <a-tooltip
                  v-else-if="get(record, 'repositoryConfiguration.archived')"
                  position="tl"
                  :content="$t('resource.repo.archived.tips')"
                >
                  <IconFont
                    type="icon-a-folderpermissions-fill"
                    class="seal-iconfont"
                  ></IconFont>
                </a-tooltip>
                <span style="display: inline-block; vertical-align: middle">{{
                  record.name
                }}</span>
                <icon-check-circle
                  v-if="record.imported"
                  style="
                    display: inline-block;
                    margin-left: 2px;
                    color: #23c343;
                    vertical-align: middle;
                  "
                />
              </template>
            </a-table-column>
            <a-table-column
              key="namespace"
              :title="$t('projects.table.namespace')"
              data-index="namespace"
            >
              <template #title>
                <a-space>
                  <span>{{ $t('projects.table.namespace') }}</span>
                  <!-- <a-input-search
                    v-model="query.namespace"
                    allow-clear
                    @click.stop="() => {}"
                    @clear="handleHeaderFilter('namespace')"
                    @input="handleHeaderFilter('namespace')"
                  /> -->
                </a-space>
              </template>
            </a-table-column>
          </template>
          <template v-if="isPartial" #footer>
            <div class="footer-btn"
              ><a-button
                type="text"
                :disabled="loadDisabled"
                size="small"
                @click="handleLoadMore"
                ><span class="text">{{
                  $t('resource.repo.list.loadmore')
                }}</span
                ><icon-double-down style="margin-left: 2px" /></a-button
            ></div>
          </template>
        </a-table>
        <div class="page-footer">
          <a-space>
            <strong>{{ selectedKeys.length }}</strong>
            <span>{{ $t('projects.table.importText') }}</span>
            <a-button
              type="primary"
              size="small"
              :loading="importLoading"
              :disabled="!selectedKeys.length"
              @click="handleToImport"
              >{{ $t('projects.table.import') }}</a-button
            >
            <a-button
              style="margin-left: 10px"
              type="text"
              size="small"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </a-space>
          <!-- <a-pagination
            size="small"
            :total="total"
            :page-size="pagination.perPage"
            :current="pagination.page"
            show-total
            show-page-size
            :hide-on-single-page="pagination.perPage === 10"
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          /> -->
        </div>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { BaseType, Pagination } from '@/types/global';
  import {
    pickBy,
    some,
    get,
    concat,
    filter,
    cloneDeep,
    uniq,
    uniqBy,
  } from 'lodash';
  import { ref, reactive, watchEffect } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    LogsTableRow,
    LogsTableParams,
    queryLogsDataList,
    postImportRepos,
    LogsTableRes,
  } from '../api/import-repo';

  interface filterMap {
    namespace?: string;
    query: string;
    description?: string;
  }
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[],
  });
  const selectedKeys = ref<BaseType[]>([]);

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const { id } = route.query;
  const dataList = ref<LogsTableRow[]>([]);
  const dataListCopy = ref<LogsTableRow[]>([]);
  const total = ref<number>(0);
  const isPartial = ref<boolean>(false);
  const importLoading = ref<boolean>(false);
  const loadDisabled = ref(false);
  const selectedCache = ref<LogsTableRow[]>([]);
  let filterTimer: any = null;
  const basePagination: Pagination = {
    page: 1,
    perPage: 50,
  };
  const query = reactive<filterMap>({
    query: '',
  });
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    ...basePagination,
  });

  const handleCancel = () => {
    router.back();
  };
  const getPermissions = (row) => {
    if (get(row, 'repositoryConfiguration.isAdmin')) {
      return t('resource.repo.permission.admin');
    }
    if (get(row, 'repositoryConfiguration.archived')) {
      return t('resource.repo.permission.archived');
    }
    return t('resource.repo.permission.no');
  };
  const setSelectCacheList = () => {};
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log('rowSelection====', rowSelection);
    selectedCache.value = filter(dataList.value, (item) => {
      return rowSelection.selectedRowKeys.includes(item.fullName);
    }) as LogsTableRow[];
  };
  const fetchData = async (flag?: boolean) => {
    try {
      let params = {
        ...pagination,
        ...query,
        id,
      } as LogsTableParams;
      setLoading(true);
      params = pickBy(
        params,
        (val: any) => val || val.length
      ) as LogsTableParams;
      const { data } = await queryLogsDataList(params);
      dataList.value = concat(dataList.value, data.items || []);
      if (flag) {
        dataList.value = uniqBy(dataList.value, 'fullName');
      }
      isPartial.value = data?.pagination?.partial as boolean;
      dataList.value = dataList.value.map((item) => {
        item.disabled = item.imported;
        return item;
      });
      rowSelection.showCheckedAll = some(dataList.value, (s) => !s.imported);
      // dataListCopy.value = [...dataList.value];
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
  const handleLoadMore = async () => {
    if (loadDisabled.value) return;
    loadDisabled.value = true;
    pagination.page += 1;
    await fetchData();
    loadDisabled.value = false;
  };
  const handleHeaderFilter = (key: string) => {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
      pagination.page = 1;
      dataList.value = dataListCopy.value.filter((item: LogsTableRow) => {
        const namespaceFlag = query.namespace
          ? item.namespace.indexOf(query.namespace) > -1
          : true;
        return namespaceFlag;
      });
    }, 400);
  };
  const handlePageChange = (page: number) => {
    pagination.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1;
    handleFilter();
  };

  const handlerSearch = () => {
    console.log('search');
    pagination.page = 1;
    isPartial.value = false;
    dataList.value = [...cloneDeep(selectedCache.value)];
    dataListCopy.value = [];
    fetchData(true);
  };
  const handlerReset = () => {
    Object.assign(query, {
      namespace: '',
      project: '',
      description: '',
    });
    pagination.page = 1;
    handleFilter();
  };

  const handleToImport = async () => {
    console.log('导入');
    // const objectList = dataListCopy.value.filter((item) =>
    //   selectedKeys.value.includes(item.fullName)
    // );
    importLoading.value = true;
    try {
      await postImportRepos(selectedCache.value);
      rowSelection.selectedRowKeys = [];
      importLoading.value = false;
      router.push({
        name: 'projectsList',
      });
    } catch (error) {
      importLoading.value = false;
      console.log(error);
    }
  };
  fetchData();
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-table-td) {
      .page-footer {
        display: flex;
        justify-content: space-between;
      }

      :deep(.arco-pagination) {
        justify-content: end;
      }
    }

    .seal-iconfont {
      display: inline-block;
      margin-right: 2px;
      color: var(--seal-color-warning);
      font-size: 14px;
      vertical-align: middle;
    }

    .footer-btn {
      text-align: center;

      .text {
        font-size: 12px;
      }

      .arco-icon {
        position: relative;
        top: -1px;
      }
    }

    :deep(.arco-card-body) {
      padding: 20px;
    }

    .page-footer {
      display: flex;
      justify-content: space-between;
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
      background: #fff;
    }

    .filter-wrap {
      display: flex;
      // background: #fff;
      margin-bottom: 12px;
    }
  }
</style>
