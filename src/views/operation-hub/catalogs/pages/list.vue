<template>
  <ComCard borderless padding="0" :loading="loading" class="projects">
    <div class="content">
      <FilterBox class="m-b-10">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('catalogs.list.query.holder')"
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
              resource: `roles.${Resources.Catalogs}`,
              actions: ['POST']
            }"
            type="primary"
            @click="handleCreate"
            >{{ $t('catalogs.list.button.add') }}</a-button
          >

          <a-button
            v-permission="{
              resource: `roles.${Resources.Catalogs}`,
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
      <a-tabs
        lazy-load
        default-active-key="currentView"
        :active-key="currentView"
      >
        <!-- <a-tab-pane key="thumb">
          <ThumbView
            :list="dataList"
            :checked-list="selectedKeys"
            @edit="handleEditItem"
            @change="handleCheckChange"
          ></ThumbView>
        </a-tab-pane> -->
        <a-tab-pane key="list">
          <ListView
            ref="listViewRef"
            v-model:sort="sort"
            v-model:selectedList="selectedKeys"
            :list="dataList"
            @edit="handleEditItem"
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
    <addCatalog
      v-model:show="showModal"
      :action="action"
      :title="modalTitle"
      :data-info="dataInfo"
      @save="handleSave"
    ></addCatalog>
  </ComCard>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { Resources } from '@/permissions/config';
  import _, { map, pickBy, remove } from 'lodash';
  import { ref, reactive, onMounted, nextTick, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { PageAction, ModalAction } from '@/views/config';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import ThumbView from '../components/thumb-view.vue';
  import ListView from '../components/list-view.vue';
  import { CatalogRowData } from '../config/interface';
  import { queryCatalogs, deleteCatalogs, CatalogAPI } from '../api';
  import addCatalog from '../components/add-catalog.vue';

  defineProps({
    currentView: {
      type: String,
      default: 'list'
    }
  });
  let timer: any = null;
  const { setChunkRequest } = useSetChunkRequest();
  const { router, t } = useCallCommon();
  const loading = ref(false);
  const selectedKeys = ref<string[]>([]);
  const sort = ref<string[]>(['-createTime']);
  const dataList = ref<CatalogRowData[]>([]);
  const listViewRef = ref();
  const total = ref(0);
  const showModal = ref(false);
  const action = ref(ModalAction.CREATE);
  const dataInfo = ref<any>({});
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: 10
  });
  const { updateChunkedList } = useUpdateChunkedList(dataList);

  const modalTitle = computed(() => {
    return action.value === ModalAction.CREATE
      ? t('catalogs.list.button.add')
      : t('catalogs.list.button.edit');
  });
  const handleCreate = () => {
    showModal.value = true;
    action.value = ModalAction.CREATE;
  };
  const handleEditItem = (item) => {
    showModal.value = true;
    action.value = ModalAction.EDIT;
    dataInfo.value = item;
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryCatalogs(params);
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
  const handleSave = () => {
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
      await deleteCatalogs({ items: ids });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      handleFilter();
      listViewRef.value.clearSelection?.();
    } catch (error) {
      loading.value = false;
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
  const createCatalogChunkRequest = () => {
    try {
      setChunkRequest({
        url: CatalogAPI,
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };
  onMounted(() => {
    fetchData();
    nextTick(() => {
      // createCatalogChunkRequest();
    });
  });
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.CatalogList
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
      padding: 2px 0 15px 2px;

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
