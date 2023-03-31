<template>
  <SpinCard borderless top-gap class="projects">
    <div class="content">
      <FilterBox style="margin-bottom: 10px">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('applications.projects.search.holder')"
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
          <a-button type="primary" @click="handleCreateProject">{{
            $t('applications.projects.create')
          }}</a-button>
          <a-button
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
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="name"
            :title="$t('applications.projects.table.name')"
          >
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
            :title="$t('common.table.operation')"
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
          >
            <template #cell="{ record }">
              <a-space :size="20">
                <a-tooltip :content="$t('common.button.edit')">
                  <a-link
                    type="text"
                    size="small"
                    @click="handleEditProject(record)"
                  >
                    <template #icon><icon-edit class="size-16" /></template>
                  </a-link>
                </a-tooltip>
                <!-- <a-tooltip :content="$t('common.button.detail')">
                  <a-link type="text" size="small" @click="handleEdit(record)">
                    <template #icon><icon-list class="size-16" /></template>
                  </a-link>
                </a-tooltip> -->
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
    <CreateProjectModal
      v-model:show="showProjectModal"
      :title="modalTitle"
      :action="action"
      :info="projectInfo"
      @save="handleSaveProject"
    ></CreateProjectModal>
  </SpinCard>
</template>

<script lang="ts" setup>
  import { cloneDeep, map, pickBy, remove } from 'lodash';
  import { ref, reactive } from 'vue';
  import dayjs from 'dayjs';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import CreateProjectModal from '../components/create-project.vue';
  import { ProjectRowData } from '../config/interface';
  import { queryProjects, deleteProjects } from '../api';

  let timer: any = null;
  const { t, router } = useCallCommon();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const loading = ref(false);
  const modalTitle = ref('');
  const showProjectModal = ref(false);
  const currentView = ref('thumb'); // thumb, list
  const dataList = ref<ProjectRowData[]>([]);
  const total = ref(0);
  const projectInfo = ref<any>({});
  const action = ref<'create' | 'edit'>('create');
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const handleToggle = (val) => {
    currentView.value = val;
  };

  const handleCreateProject = () => {
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
  const handleEdit = (row) => {
    const path = router.push({
      name: 'ApplicationsDetail',
      query: { id: row.id }
    });
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val)
      };
      const { data } = await queryProjects(params);
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
  const handleSaveProject = () => {
    queryParams.query = '';
    queryParams.page = 1;
    handleFilter();
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
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteProjects(ids);
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
