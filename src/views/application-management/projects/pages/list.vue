<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{
          icon: 'icon-apps',
          label: $t('menu.applicationManagement.projectList')
        }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo
        :info="{ name: $t('menu.applicationManagement.projectList') }"
      >
        <template #icon>
          <i class="iconfont icon-app-fill"></i>
        </template>
      </HeaderInfo>
    </ComCard>
    <SpinCard
      borderless
      class="projects"
      padding="0 var(--card-content-padding) 20px"
    >
      <div class="content">
        <FilterBox style="margin-bottom: var(--filter-box-margin)">
          <template #params>
            <a-input
              v-model.trim="queryParams.query"
              allow-clear
              style="width: 240px"
              :placeholder="$t('common.search.name.placeholder')"
              @clear="handleSearch"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input>
            <a-space style="margin-left: 0" :size="10">
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
                resource: `roles.${Resources.Projects}`,
                actions: ['POST']
              }"
              type="primary"
              @click="handleCreate"
              >{{ $t('applications.projects.create') }}</a-button
            >
            <a-button
              v-permission="{
                resource: `roles.${Resources.Projects}`,
                actions: ['DELETE']
              }"
              type="primary"
              status="warning"
              :disabled="!selectedKeys.length"
              @click="() => handleDelete()"
              >{{ $t('common.button.delete')
              }}<span v-if="selectedKeys.length">{{
                `(${selectedKeys.length})`
              }}</span></a-button
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
          @cell-click="handleCellClick"
          @selection-change="handleSelectChange"
          @sorter-change="handleSortChange"
        >
          <template #columns>
            <a-table-column
              ellipsis
              tooltip
              :body-cell-class="
                (record) =>
                  userStore.hasProjectResourceActions({
                    projectID: record.id,
                    resource: Resources.Projects,
                    actions: [Actions.GET]
                  })
                    ? 'clickable'
                    : ''
              "
              :cell-style="{ minWidth: '40px' }"
              data-index="name"
              :title="
                $t('common.table.name.list', {
                  type: $t('applications.projects.table.name')
                })
              "
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: '',
                sorter: true,
                sortOrder: sortDataIndex === 'name' ? sortOrder : ''
              }"
            >
              <template #cell="{ record }">
                <a-link
                  v-if="
                    userStore.hasProjectResourceActions({
                      projectID: record.id,
                      resource: Resources.Projects,
                      actions: [Actions.GET]
                    })
                  "
                  :hoverable="false"
                  size="small"
                  >{{ record.name }}</a-link
                >
                <span v-else>{{ record.name }}</span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="description"
              :title="$t('common.table.description')"
            >
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="createTime"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend',
                sorter: true,
                sortOrder: sortDataIndex === 'createTime' ? sortOrder : ''
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
              align="left"
              :title="$t('common.table.operation')"
              ellipsis
              tooltip
              :width="210"
              :cell-style="{ minWidth: '40px' }"
            >
              <template #cell="{ record }">
                <DropButtonGroup
                  :layout="
                    setActionList(record).length === 1
                      ? 'horizontal'
                      : 'vertical'
                  "
                  :actions="setActionList(record)"
                  @select="(value) => handleClickAction(value, record)"
                ></DropButtonGroup>
              </template>
            </a-table-column>
          </template>
          <template #empty>
            <result-view
              :loading="loading"
              :title="
                queryParams.query
                  ? $t('project.result.nodata.title')
                  : $t('project.result.title')
              "
              :subtitle="
                queryParams.query
                  ? $t('common.result.nodata.subtitle')
                  : $t('project.result.subTitle')
              "
            >
              <template #icon>
                <icon-find-replace v-if="queryParams.query" />
                <i v-else class="iconfont icon-PROJECT"></i>
              </template>
              <template #extra>
                <a-button
                  v-if="
                    userStore.hasRolesActionsPermission({
                      resource: Resources.Projects,
                      actions: [Actions.POST]
                    }) && !queryParams.query
                  "
                  type="outline"
                  @click="handleCreate"
                  ><icon-plus class="m-r-4" />{{
                    $t('common.button.create.now')
                  }}</a-button
                >
              </template>
            </result-view>
          </template>
        </a-table>
        <a-pagination
          size="small"
          :total="total"
          :page-size="queryParams.perPage"
          :current="queryParams.page"
          show-total
          show-page-size
          :hide-on-single-page="total <= 10"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
      <CreateProjectModal
        v-model:show="showProjectModal"
        :title="modalTitle"
        :action="action"
        :info="projectInfo"
        @save="handleSaveProject"
      ></CreateProjectModal>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import _, { cloneDeep, map, pickBy, remove } from 'lodash';
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { useUserStore, useProjectStore, useAppStore } from '@/store';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import CreateProjectModal from '../components/create-project.vue';
  import { ProjectRowData } from '../config/interface';
  import { queryProjects, deleteProjects } from '../api';
  import { actionList } from '../config';

  let timer: any = null;
  const appStore = useAppStore();
  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const { t, router } = useCallCommon();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  const loading = ref(false);
  const modalTitle = ref('');
  const showProjectModal = ref(false);
  const dataList = ref<ProjectRowData[]>([]);
  const total = ref(0);
  const projectInfo = ref<any>({});
  const projectID = ref('');
  const action = ref<'create' | 'edit'>('create');
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });

  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return item.filterFun ? item.filterFun({ row }) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.({ row })
        : item.disabled;
      return item;
    });
    return res;
  };
  const handleCreate = () => {
    action.value = 'create';
    projectInfo.value = {};
    setTimeout(() => {
      showProjectModal.value = true;
    }, 100);
    modalTitle.value = t('applications.projects.create');
  };
  const handleEditProject = (row: any) => {
    action.value = 'edit';
    projectInfo.value = { ...cloneDeep(row) };
    setTimeout(() => {
      showProjectModal.value = true;
      modalTitle.value = t('applications.projects.edit');
    }, 100);
  };

  const handleViewProject = async (row) => {
    router.push({
      name: PROJECT.Detail,
      params: { projectId: row.id }
    });
  };
  const handleCellClick = (row, col) => {
    if (
      col.dataIndex === 'name' &&
      userStore.hasProjectResourceActions({
        projectID: row.id,
        resource: Resources.Projects,
        actions: [Actions.GET]
      })
    ) {
      handleViewProject(row);
    }
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryProjects(params);
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          disabled: !userStore.hasProjectResourceActions({
            projectID: item.id,
            resource: Resources.Projects,
            actions: [Actions.DELETE]
          })
        };
      });
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSaveProject = () => {
    queryParams.query = '';
    queryParams.page = 1;
    handleFilter();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    console.log(dataIndex, direction);
    setSortDirection(dataIndex, direction);
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
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };

  const setEnterProjectDefault = () => {
    projectStore.setEnterProjectDefault({
      projectId: '',
      detail: false,
      list: true
    });
  };
  const updateProjectStore = async (list) => {
    const ids = map(list, (item) => item.id);
    projectStore.removeProjects(ids);
    const defaultProject = projectStore.defaultActiveProject;
    if (ids.includes(defaultProject?.id)) {
      projectStore.setInfo({
        defaultActiveProject: null
      });
    }
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val as string
        };
      });
      await deleteProjects({ items: ids });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
      await updateProjectStore(ids);
    } catch (error) {
      loading.value = false;
    }
  };
  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };

  const handleClickAction = (value, row) => {
    if (value === 'edit') {
      handleEditProject(row);
      return;
    }
    if (value === 'delete') {
      handleDelete([row.id]);
    }
  };
  onMounted(() => {
    setEnterProjectDefault();
  });
  fetchData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.List
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
        border-radius: var(--border-radius-small);
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
