<template>
  <SpinCard
    borderless
    top-gap
    class="projects"
    :title="$t('applications.projects.menu')"
  >
    <template #title>
      <div class="title">
        <span>{{ $t('applications.projects.menu') }}</span>
        <a-divider direction="vertical" :margin="10"></a-divider>
        <icon-apps
          :class="{ active: currentView === 'thumb' }"
          @click="handleToggle('thumb')"
        />
        <icon-nav
          :class="{ active: currentView === 'list' }"
          @click="handleToggle('list')"
        />
      </div>
    </template>
    <div class="content">
      <FilterBox>
        <template #params>
          <a-input
            v-model="queryParams.name"
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
      <a-divider :margin="8"></a-divider>
      <a-tabs
        default-active-key="currentView"
        :active-key="currentView"
        @change="handleToggle"
      >
        <a-tab-pane key="thumb">
          <ThumbView
            :list="dataList"
            :checked-list="selectedKeys"
            @change="handleCheckChange"
          ></ThumbView>
        </a-tab-pane>
        <a-tab-pane key="list">
          <ListView
            v-model:selectedList="selectedKeys"
            :list="dataList"
            @edit="handleEditProject"
          ></ListView>
        </a-tab-pane>
      </a-tabs>
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
    <CreateProject
      v-model:show="showProjectModal"
      :title="modalTitle"
      @save="handleSaveProject"
    ></CreateProject>
  </SpinCard>
</template>

<script lang="ts" setup>
  import { map, remove } from 'lodash';
  import { ref, reactive } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import ThumbView from '../components/thumb-view.vue';
  import ListView from '../components/list-view.vue';
  import CreateProject from '../components/create-project.vue';
  import { ProjectItem } from '../config/interface';

  let timer: any = null;
  const { t } = useCallCommon();
  const loading = ref(false);
  const modalTitle = ref('');
  const showProjectModal = ref(false);
  const currentView = ref('thumb'); // thumb, list
  const selectedKeys = ref<string[]>([]);
  const dataList = ref<ProjectItem[]>(
    Array(10).fill({ name: 'project name', id: '1' })
  );
  const total = ref(100);
  const queryParams = reactive({
    name: '',
    page: 1,
    perPage: 10
  });
  const handleToggle = (val) => {
    currentView.value = val;
  };
  const handleCreateProject = () => {
    showProjectModal.value = true;
    modalTitle.value = t('applications.projects.create');
  };
  const handleEditProject = (row) => {
    showProjectModal.value = true;
    modalTitle.value = t('applications.projects.edit');
  };
  const fetchData = async () => {};
  const handleFilter = () => {
    fetchData();
  };
  const handleSaveProject = () => {
    queryParams.name = '';
    queryParams.page = 1;
    handleFilter();
  };
  const handleCheckChange = (checked, id) => {
    if (checked) {
      selectedKeys.value.push(id);
    } else {
      remove(selectedKeys.value, (val) => val === id);
    }
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.name = '';
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
      // await deleteRepos(ids);
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
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
