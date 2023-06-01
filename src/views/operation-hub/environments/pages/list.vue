<template>
  <SpinCard borderless top-gap class="projects">
    <!-- <template #title>
      <div class="title">
        <icon-apps
          :class="{ active: currentView === 'thumb' }"
          @click="handleToggle('thumb')"
        />
        <icon-nav
          :class="{ active: currentView === 'list' }"
          @click="handleToggle('list')"
        />
      </div>
    </template> -->
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
            v-permission="{
              resource: `roles.${Resources.Environments}`,
              actions: ['POST']
            }"
            type="primary"
            @click="handleCreateProject"
            >{{ $t('operation.environments.create') }}</a-button
          >
          <a-button
            v-permission="{
              resource: `roles.${Resources.Environments}`,
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
      <!-- <a-divider :margin="8"></a-divider> -->
      <!-- <a-tabs
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
          ></ListView>
        </a-tab-pane>
      </a-tabs> -->
      <ListView
        v-model:selectedList="selectedKeys"
        v-model:sort="sort"
        :list="dataList"
        :loading="loading"
        @sort="handleSort"
      ></ListView>
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
  </SpinCard>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { map, pickBy, remove } from 'lodash';
  import { ref, reactive } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import ThumbView from '../components/thumb-view.vue';
  import ListView from '../components/list-view.vue';
  import { EnvironmentRow } from '../config/interface';
  import { queryEnvironments, deleteEnvironment } from '../api';

  let timer: any = null;
  const { router } = useCallCommon();
  const loading = ref(false);
  const currentView = ref('thumb'); // thumb, list
  const selectedKeys = ref<string[]>([]);
  const dataList = ref<EnvironmentRow[]>([]);
  const total = ref(0);
  const sort = ref<string[]>(['-createTime']);
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const handleToggle = (val) => {
    currentView.value = val;
  };
  const handleCreateProject = () => {
    router.push({
      name: 'EnvironmentDetail',
      params: {
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
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSort = () => {
    fetchData();
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
      await deleteEnvironment(ids);
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
