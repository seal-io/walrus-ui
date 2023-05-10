<template>
  <SpinCard
    borderless
    top-gap
    :loading="loading"
    class="projects"
    :title="$t('operation.templates.table.title')"
  >
    <template #title>
      <div class="title">
        <!-- <span>{{ $t('operation.templates.table.title') }}</span> -->
        <!-- <a-divider direction="vertical" :margin="10"></a-divider> -->
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
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('operation.templates.table.holder')"
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
          <a-button type="primary" @click="handleDraftModule">
            <template #icon>
              <icon-font type="icon-ChatGPT"></icon-font>
            </template>
            <span>{{ $t('operation.templates.button.gpt') }}</span>
          </a-button>
          <a-button type="primary" @click="handleCreateProject">{{
            $t('operation.templates.detail.add')
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
        lazy-load
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
            ref="listViewRef"
            v-model:sort="sort"
            v-model:selectedList="selectedKeys"
            :list="dataList"
            @sort="handleSort"
          ></ListView>
        </a-tab-pane>
      </a-tabs>
      <a-pagination
        style="margin-top: 20px"
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
  import _, { map, pickBy, remove } from 'lodash';
  import { ref, reactive, onMounted, nextTick } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { websocketEventType } from '@/views/config';
  import ThumbView from '../components/thumb-view.vue';
  import ListView from '../components/list-view.vue';
  import { TemplateRowData } from '../config/interface';
  import { queryModules, deleteModules } from '../api';

  let timer: any = null;
  const { setChunkRequest } = useSetChunkRequest();
  const { router } = useCallCommon();
  const loading = ref(false);
  const currentView = ref('thumb'); // thumb, list
  const selectedKeys = ref<string[]>([]);
  const sort = ref<string[]>(['-createTime']);
  const dataList = ref<TemplateRowData[]>([]);
  const listViewRef = ref();
  const total = ref(0);
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
      name: 'TemplateDetail',
      params: {
        action: 'edit'
      }
    });
  };
  const handleDraftModule = () => {
    router.push({
      name: 'TemplateGPT'
    });
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryModules(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      loading.value = false;
    } finally {
      loading.value = false;
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
      await deleteModules(ids);
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      handleFilter();
      listViewRef.value.clearSelection?.();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const updateModuleList = (data) => {
    const collections = data?.collection || [];
    // CREATE
    if (data?.type === websocketEventType.create) {
      dataList.value = _.concat(collections, dataList.value);
      return;
    }
    // UPDATE
    _.each(collections, (item) => {
      const updateIndex = _.findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = _.cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      } else {
        dataList.value = _.concat(_.cloneDeep(item), dataList.value);
      }
    });
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateModuleList(data);
    });
  };
  const createInstanceListWebsocket = () => {
    try {
      setChunkRequest({
        url: `/modules`,
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    fetchData();
    nextTick(() => {
      // createInstanceListWebsocket();
    });
  });
</script>

<script lang="ts">
  export default {
    name: 'TemplateList'
  };
</script>

<style lang="less" scoped>
  .projects {
    .gpt-button {
      display: flex;
      align-items: center;

      .size-14 {
        margin-right: 4px;
        font-size: 12px;
      }
    }

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
