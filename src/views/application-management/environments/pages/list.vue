<template>
  <ComCard borderless class="projects" padding="0">
    <div class="content">
      <FilterBox style="margin-bottom: 10px">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('operation.environments.table.holder')"
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
            v-if="
              userStore.hasProjectResourceActions({
                projectID: queryParams.projectID,
                resource: Resources.Environments,
                actions: [Actions.POST]
              })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('operation.environments.create') }}</a-button
          >
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                projectID: queryParams.projectID,
                resource: Resources.Environments,
                actions: [Actions.DELETE]
              })
            "
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
            :title="$t('operation.environments.table.env')"
          >
            <template #cell="{ record }">
              <a-link
                v-if="record.connectors?.length"
                type="text"
                size="small"
                @click="handleView(record)"
              >
                {{ record.name }}
              </a-link>
              <span v-else style="display: flex; align-items: center">
                <span>{{ record.name }}</span>
                <a-tooltip :content="$t('applications.instance.env.tips')">
                  <icon-exclamation-circle-fill
                    class="mleft-5"
                    style="color: var(--color-text-2)"
                  />
                </a-tooltip>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="description"
            :title="$t('common.table.description')"
          >
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
          <a-table-column
            align="center"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record }">
              <a-space>
                <a-tooltip
                  v-if="
                    userStore.hasProjectResourceActions({
                      projectID: queryParams.projectID,
                      resource: Resources.Environments,
                      actions: [Actions.PUT]
                    })
                  "
                  :content="$t('common.button.edit')"
                >
                  <a-link type="text" size="small" @click="handleEdit(record)">
                    <template #icon><icon-edit class="size-14" /></template>
                  </a-link>
                </a-tooltip>
                <a-tooltip
                  v-if="
                    userStore.hasProjectResourceActions({
                      projectID: queryParams.projectID,
                      resource: Resources.Environments,
                      actions: [Actions.POST]
                    })
                  "
                  :disabled="!record.connectors?.length"
                  :content="$t('applications.environment.clone')"
                >
                  <a-link
                    :disabled="!record.connectors?.length"
                    type="text"
                    size="small"
                    @click="handleClone(record)"
                  >
                    <template #icon
                      ><i class="size-14 icon-Clone-Cloud iconfont"
                    /></template>
                  </a-link>
                </a-tooltip>
                <a-tooltip :content="$t('common.button.detail')">
                  <a-link
                    type="text"
                    size="small"
                    @click="handleViewDetail(record)"
                  >
                    <template #icon
                      ><i class="size-14 icon-xiangqing iconfont"
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
    </div>
    <CreateEnvironment
      v-model:show="showModal"
      v-model:info="currentInfo"
      :action="action"
      @save="handleSearch"
    ></CreateEnvironment>
  </ComCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { PageAction } from '@/views/config';
  import { PROJECT } from '@/router/config';
  import { useUserStore } from '@/store';
  import { Resources, Actions } from '@/permissions/config';
  import { map, pickBy, remove } from 'lodash';
  import { ref, reactive, onActivated } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import { EnvironmentRow } from '../config/interface';
  import { queryEnvironments, deleteEnvironment } from '../api';
  import CreateEnvironment from '../components/create-environment.vue';

  let timer: any = null;
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const userStore = useUserStore();
  const { router, route } = useCallCommon();
  const loading = ref(false);
  const dataList = ref<EnvironmentRow[]>([]);
  const total = ref(0);
  const showModal = ref(false);
  const currentInfo = ref({});
  const action = ref('edit');
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10,
    projectID: route.params.projectId
  });

  const handleCreate = () => {
    // action.value = 'create';
    // showModal.value = true;
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        projectId: route.params.projectId,
        action: 'edit'
      }
    });
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryEnvironments(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleFilter = () => {
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    fetchData();
  };
  onActivated(() => {
    // fetchData();
  });
  const handleView = (row) => {
    router.push({
      name: PROJECT.EnvDetail,
      params: {
        ...route.params,
        environmentId: row.id
      }
    });
  };
  const handleEdit = (row) => {
    // currentInfo.value = row;
    // action.value = 'edit';
    // setTimeout(() => {
    //   showModal.value = true;
    // }, 100);
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        action: PageAction.EDIT
      },
      query: { id: row.id }
    });
  };
  const handleViewDetail = (row) => {
    router.push({
      name: PROJECT.EnvEdit,
      params: {
        action: PageAction.VIEW
      },
      query: { id: row.id }
    });
  };
  const handleClone = (row) => {
    router.push({
      name: PROJECT.EnvClone,
      params: {
        environmentId: row.id
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
      await deleteEnvironment(ids);
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
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'EnvironmentList'
  };
</script>

<style lang="less" scoped>
  .projects {
    .title {
      display: flex;
      align-items: center;

      :deep(.arco-icon) {
        margin-right: 6px;
        color: var(--color-text-2);
        font-size: 20px;
        border-radius: 4px;
        cursor: pointer;
        .hoverable();

        &:hover {
          color: rgb(var(--arcoblue-6));
          .hoverableHover();
        }
      }

      .arco-icon.active {
        color: rgb(var(--arcoblue-6));
        box-shadow: var(--seal-hoverable-shadow);
      }
    }

    .content {
      :deep(.arco-tabs-nav-tab) {
        display: none;
      }

      :deep(.arco-tabs-content) {
        padding-top: 0;
      }
    }
  }
</style>
