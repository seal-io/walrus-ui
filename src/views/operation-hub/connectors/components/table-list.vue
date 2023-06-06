<template>
  <div class="connectors-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 240px"
          :placeholder="$t('operation.connectors.table.holder')"
          @clear="handleSearch"
          @change="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-space style="margin-left: 10px">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <a-button
          v-permission="{
            resource: `roles.${Resources.Connectors}`,
            actions: ['POST']
          }"
          type="primary"
          @click="handleCreate"
          >{{ $t('operation.connectors.create') }}</a-button
        >
        <a-button
          v-permission="{
            resource: `roles.${Resources.Connectors}`,
            actions: ['DELETE']
          }"
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </template>
    </FilterBox>
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelection"
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('operation.connectors.table.connector')"
        >
          <template #cell="{ record }">
            <a-link type="text" size="small" @click="handleView(record)">
              {{ record.name }}
            </a-link>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          align="left"
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="$t('operation.connectors.table.type')"
        >
          <template #cell="{ record }">
            <span
              v-if="_.includes([ConnectorCategory.Custom], category)"
              class="mright-5"
            >
              <icon-font
                type="icon-custom"
                class="size-16"
                style="color: rgb(var(--arcoblue-5))"
              ></icon-font>
            </span>
            <span v-else class="mright-5">
              <ProviderIcon :provider="toLower(record.type)"></ProviderIcon>
            </span>
            <span>{{ record.type }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="category !== ConnectorCategory.Custom"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="finOpsStatus"
          :title="$t('operation.connectors.table.status')"
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
        <a-table-column
          v-if="category === ConnectorCategory.Kubernetes"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="CostSynced"
          :title="$t('operation.connectors.table.coststatus')"
        >
          <template #cell="{ record }">
            <span>{{ getCostStatus(record.status?.conditions || []) }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
            sorter: true,
            sortOrder: sortOrder
          }"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="enableFinOps"
          :title="$t('operation.connectors.table.enableFin')"
        >
          <template #cell="{ record }">
            <a-switch
              v-model="record.enableFinOps"
              size="small"
              @change="(val) => handleEnableFinOps(val, record)"
            ></a-switch>
          </template>
        </a-table-column> -->
        <a-table-column
          align="center"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
        >
          <template #cell="{ record }">
            <a-space
              v-if="
                userStore.hasRolesActionsPermission({
                  resource: Resources.Connectors,
                  actions: ['PUT']
                })
              "
              :size="10"
            >
              <a-dropdown-button
                v-if="category === ConnectorCategory.Kubernetes"
                size="small"
              >
                <a-tooltip :content="$t('common.button.edit')">
                  <a-link
                    class="mright-0"
                    type="text"
                    size="small"
                    @click="handleClickEdit(record)"
                  >
                    <template #icon><icon-edit class="size-14" /></template>
                  </a-link>
                </a-tooltip>
                <template #icon>
                  <icon-more style="font-size: 18px; stroke-width: 5" />
                </template>
                <template #content>
                  <a-doption v-if="record.enableFinOps">
                    <a-tooltip
                      :content="$t('operation.connectors.table.install')"
                    >
                      <a-link
                        type="text"
                        size="small"
                        @click="handleReinstall(record)"
                      >
                        <template #icon
                          ><icon-font type="icon-install" class="size-16"
                        /></template>
                      </a-link>
                    </a-tooltip>
                  </a-doption>
                  <a-doption v-if="record.enableFinOps">
                    <a-tooltip
                      :content="$t('operation.connectors.table.fetch')"
                    >
                      <a-link
                        type="text"
                        size="small"
                        :loading="record.loading"
                        @click="handleFetchCost(record)"
                      >
                        <template #icon
                          ><icon-cloud-download class="size-16"
                        /></template>
                      </a-link>
                    </a-tooltip>
                  </a-doption>
                  <a-doption v-if="category === ConnectorCategory.Kubernetes">
                    <a-tooltip
                      :content="$t('operation.connectors.table.enableFin')"
                    >
                      <a-switch
                        v-model="record.enableFinOps"
                        size="small"
                        @change="(val) => handleEnableFinOps(val, record)"
                      ></a-switch>
                    </a-tooltip>
                  </a-doption>
                </template>
              </a-dropdown-button>
              <a-link
                v-else
                type="text"
                size="small"
                @click="handleClickEdit(record)"
              >
                <template #icon><icon-edit class="size-16" /></template>
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
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import useAxiosSource from '@/hooks/use-axios-cancel';
  import { UseSortDirection } from '@/utils/common';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import dayjs from 'dayjs';
  import _, { get, map, pickBy, find, toLower, cloneDeep } from 'lodash';
  import {
    reactive,
    ref,
    onMounted,
    onActivated,
    watch,
    nextTick,
    inject
  } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { ConnectorRowData } from '../config/interface';
  import { ConnectorCategory } from '../config';
  import StatusLabel from './status-label.vue';
  import {
    queryConnectors,
    updateConnector,
    reinstallFinOpsTools,
    syncFinOpsData,
    deleteConnector
  } from '../api';

  const props = defineProps({
    category: {
      type: String,
      default() {
        return '';
      }
    },
    editPage: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const axiosSource = useAxiosSource();
  let axiosToken: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, route, t } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  let timer: any = null;
  const loading = ref(false);
  const total = ref(0);
  const activeKey = inject('activeKey', ref(''));
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10,
    category: props.category,
    projectID: route.params.projectId
  });
  const dataList = ref<ConnectorRowData[]>([]);

  const { updateChunkedList } = useUpdateChunkedList(dataList, {
    filterFun(item) {
      return item?.category === props.category;
    }
  });
  const getCostStatus = (conditions) => {
    const d = find(conditions, (item) => {
      return item.type === 'CostSynced';
    });
    return d?.message;
  };
  const fetchData = async () => {
    axiosToken?.cancel();
    axiosToken = axiosSource();
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryConnectors(params, axiosToken?.token);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    console.log('dataIndex===', dataIndex, direction);
    fetchData();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.query = '';
    queryParams.page = 1;
    handleFilter();
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
  const handleCreate = () => {
    router.push({
      name: props.editPage,
      params: {
        action: 'edit'
      }
    });
  };
  const handleView = (row) => {
    router.push({
      name: props.editPage,
      params: {
        action: 'view'
      },
      query: {
        id: row.id
      }
    });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteConnector(ids);
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };

  const handleClickEdit = (row) => {
    router.push({
      name: props.editPage,
      params: {
        action: 'edit'
      },
      query: { id: row.id }
    });
  };
  const handleReinstallConfirm = async (row) => {
    try {
      loading.value = true;
      await reinstallFinOpsTools(row);
      Message.success(t('common.message.success'));
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleReinstall = async (row) => {
    deleteModal({
      title: 'operation.connectors.reinstall.tips',
      okText: 'operation.connectors.reinstall.button',
      onOk: () => {
        handleReinstallConfirm(row);
      }
    });
  };
  const handleFetchCost = async (row) => {
    try {
      row.loading = true;
      await syncFinOpsData(row);
      Message.success(t('common.message.success'));
      row.loading = false;
    } catch (error) {
      row.loading = false;
      console.log(error);
    }
  };
  const handleEnableFinOps = async (enable, data) => {
    try {
      loading.value = true;
      const row = cloneDeep(data);
      row.enableFinOps = enable;
      row.configData = null;
      await updateConnector(row);
      loading.value = false;
      Message.success(t('common.message.success'));
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };

  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };
  const createInstanceListWebsocket = () => {
    try {
      setChunkRequest({
        url: `/connectors`,
        params: {
          category: props.category
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };
  onActivated(() => {
    if (activeKey.value === props.category) {
      fetchData();
    }
  });
  onMounted(() => {
    fetchData();
    nextTick(() => {
      createInstanceListWebsocket();
    });
  });
  watch(
    () => props.category,
    () => {
      // fetchData();
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .mright-0 {
    :deep(.arco-link-icon) {
      margin-right: 0;
    }
  }
</style>
