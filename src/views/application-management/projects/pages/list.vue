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
              v-model.trim="queryParams.fieldSelector"
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
              ref="createBtn"
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
          row-key="metadataName"
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
                    projectID: record.metadata?.name,
                    resource: Resources.Projects,
                    actions: [Actions.GET]
                  })
                    ? 'clickable'
                    : ''
              "
              :cell-style="{ minWidth: '40px' }"
              data-index="metadata.name"
              :title="
                $t('common.table.name.list', {
                  type: $t('applications.projects.table.name')
                })
              "
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: '',
                sorter: true,
                sortOrder: sortDataIndex === 'metadata.name' ? sortOrder : ''
              }"
            >
              <template #cell="{ record }">
                <a-link
                  v-if="
                    userStore.hasProjectResourceActions({
                      projectID: record.metadata?.name,
                      resource: Resources.Projects,
                      actions: [Actions.GET]
                    })
                  "
                  :hoverable="false"
                  size="small"
                  >{{ record.metadata?.name }}</a-link
                >
                <span v-else>{{ record.metadata?.name }}</span>
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="left"
              data-index="spec.description"
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
                queryParams.fieldSelector
                  ? $t('project.result.nodata.title')
                  : $t('project.result.title')
              "
              :subtitle="
                queryParams.fieldSelector
                  ? $t('common.result.nodata.subtitle')
                  : $t('project.result.subTitle')
              "
            >
              <template #icon>
                <icon-find-replace v-if="queryParams.fieldSelector" />
                <i v-else class="iconfont icon-PROJECT"></i>
              </template>
              <template #extra>
                <a-button
                  v-if="
                    userStore.hasRolesActionsPermission({
                      resource: Resources.Projects,
                      actions: [Actions.POST]
                    }) && !queryParams.fieldSelector
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
        <LoadMore
          v-if="dataList.length > 0"
          v-model:page-size="queryParams.limit"
          class="m-t-20"
          :continue="!!queryParams.continue"
          @loadMore="handleFilter"
          @page-size-change="handlePageSizeChange"
        ></LoadMore>
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
  import LoadMore from '@/components/pagination/load-more.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { handleBatchRequest } from '@/views/config/utils';
  import { UseSortDirection } from '@/utils/common';
  import useRowSelect from '@/hooks/use-row-select';
  import useHotKeys, { HotKeys } from '@/hooks/use-hot-keys';
  import CreateProjectModal from '../components/create-project.vue';
  import { ProjectRowData } from '../config/interface';
  import { queryProjects, deleteProjects, GlobalNamespace } from '../api';
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
  const createBtn = ref();
  const loading = ref(false);
  const modalTitle = ref('');
  const showProjectModal = ref(false);
  const dataList = ref<ProjectRowData[]>([]);
  const total = ref(0);
  const projectInfo = ref<any>({});
  const action = ref<'create' | 'edit'>('create');
  const queryParams = reactive({
    fieldSelector: '',
    limit: appStore.perPage || 20,
    continue: ''
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
      params: { projectName: row.metadata?.name }
    });
  };
  const handleCellClick = (row, col) => {
    console.log('handleCellclick', row, col);
    if (
      col.dataIndex === 'metadata.name' &&
      userStore.hasProjectResourceActions({
        projectID: row.metadata?.name,
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
        sort: [sort.value],
        namespace: GlobalNamespace
      };
      const { data } = await queryProjects(params);
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          metadataName: item.metadata?.name,
          disabled: !userStore.hasProjectResourceActions({
            projectID: item.metadata?.name,
            resource: Resources.Projects,
            actions: [Actions.DELETE]
          })
        };
      });
      queryParams.continue = data?.metadata?.continue || '';
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSaveProject = () => {
    queryParams.continue = '';
    handleFilter();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    console.log(dataIndex, direction);
    setSortDirection(dataIndex, direction);
    fetchData();
  };
  const handleSearch = () => {
    queryParams.continue = '';
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.fieldSelector = '';
    queryParams.continue = '';
    handleFilter();
  };

  const handlePageSizeChange = (pageSize: number) => {
    queryParams.continue = '';
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };

  const setEnterProjectDefault = () => {
    projectStore.setEnterProjectDefault({
      projectName: '',
      detail: false,
      list: true
    });
  };
  const updateProjectStore = async (list) => {
    const names = map(list, (item) => item.name);
    projectStore.removeProjects(names);
    const defaultProject = projectStore.defaultActiveProject;
    if (names.includes(defaultProject?.name)) {
      projectStore.setInfo({
        defaultActiveProject: null
      });
    }
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const nameList = map(delList || selectedKeys.value, (val) => {
        return {
          name: val,
          namespace: GlobalNamespace
        };
      });
      await handleBatchRequest(nameList, deleteProjects);
      loading.value = false;
      execSucceed();
      queryParams.continue = '';
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
      await updateProjectStore(nameList);
    } catch (error) {
      loading.value = false;
    }
  };
  const handleDelete = async (names?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(names) });
  };

  const handleClickAction = (value, row) => {
    if (value === 'edit') {
      handleEditProject(row);
      return;
    }
    if (value === 'delete') {
      handleDelete([row.metadata.name]);
    }
  };

  useHotKeys([
    {
      key: HotKeys.Delete,
      callback: () => {
        if (selectedKeys.value.length) {
          handleDelete();
        }
      }
    },
    {
      key: HotKeys.Refresh,
      callback: () => {
        handleFilter();
      }
    },
    {
      key: HotKeys.Create,
      options: {
        element: createBtn.value
      },
      callback: () => {
        handleCreate();
      }
    }
  ]);

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
