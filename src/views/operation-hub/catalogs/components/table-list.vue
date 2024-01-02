<template>
  <ComCard borderless padding="0" class="projects">
    <div class="content">
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #params>
          <a-input
            v-model="queryParams.query"
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
            v-if="
              route.params.projectId
                ? userStore.hasProjectResourceActions({
                    resource: Resources.Catalogs,
                    projectID: route.params.projectId,
                    actions: [Actions.POST]
                  })
                : userStore.hasRolesActionsPermission({
                    resource: Resources.Catalogs,
                    actions: [Actions.POST]
                  })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('catalogs.list.button.add') }}</a-button
          >

          <a-button
            v-if="
              route.params.projectId
                ? userStore.hasProjectResourceActions({
                    resource: Resources.Catalogs,
                    projectID: route.params.projectId,
                    actions: [Actions.DELETE]
                  })
                : userStore.hasRolesActionsPermission({
                    resource: Resources.Catalogs,
                    actions: [Actions.DELETE]
                  })
            "
            type="primary"
            status="warning"
            :disabled="!selectedKeys.length"
            @click="handleDelete"
            >{{ $t('common.button.delete')
            }}<span v-if="selectedKeys.length">{{
              `(${selectedKeys.length})`
            }}</span></a-button
          >
        </template>
      </FilterBox>
      <a-spin :loading="loading">
        <a-tabs
          lazy-load
          default-active-key="currentView"
          :active-key="currentView"
        >
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
      </a-spin>
      <a-pagination
        style="margin-top: 20px"
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
    <addCatalog
      v-model:show="showModal"
      v-model:data-info="dataInfo"
      :action="action"
      :title="modalTitle"
      @save="handleSave"
    ></addCatalog>
  </ComCard>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import _, { map, pickBy, remove } from 'lodash';
  import { useUserStore, useAppStore } from '@/store';
  import { ref, reactive, onMounted, nextTick, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { PageAction, ModalAction } from '@/views/config';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import ListView from './list-view.vue';
  import { CatalogRowData } from '../config/interface';
  import {
    queryCatalogs,
    deleteCatalogs,
    CatalogAPI,
    PROJECT_API_PREFIX
  } from '../api';
  import addCatalog from './add-catalog.vue';

  const props = defineProps({
    currentView: {
      type: String,
      default: 'list'
    },
    scope: {
      type: String as PropType<'project' | 'global'>,
      default: 'global'
    }
  });
  let timer: any = null;
  const builtinCatalog = 'https://catalog.seal.io/walrus-catalog';
  const builtinCatalogName = 'builtin';
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const { router, route, t } = useCallCommon();
  const loading = ref(false);
  const selectedKeys = ref<string[]>([]);
  const sort = ref<string>('-createTime');
  const dataList = ref<CatalogRowData[]>([]);
  const listViewRef = ref();
  const total = ref(0);
  const showModal = ref(false);
  const action = ref(ModalAction.CREATE);
  const dataInfo = ref<any>({});
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });
  const { updateChunkedList } = useUpdateChunkedList(dataList, {
    mapFun(item) {
      item.disabled =
        userStore.userSetting?.EnableBuiltinCatalog?.value === 'true' &&
        item.source === builtinCatalog &&
        item.name === builtinCatalogName;
      return item;
    }
  });

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

      dataList.value = _.map(data?.items || [], (sItem) => {
        sItem.disabled =
          userStore.userSetting?.EnableBuiltinCatalog?.value === 'true' &&
          sItem.source === builtinCatalog &&
          sItem.name === builtinCatalogName;
        return sItem;
      });
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
  const handleSave = () => {};
  const handleCheckChange = (checked, id) => {
    if (checked) {
      selectedKeys.value.push(id);
    } else {
      remove(selectedKeys.value, (val) => val === id);
    }
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
    let url = CatalogAPI;
    if (props.scope === 'project') {
      url = `${PROJECT_API_PREFIX()}${CatalogAPI}`;
    }
    try {
      setChunkRequest({
        url,
        params: {
          ..._.pickBy(queryParams, (val) => !!val)
        },
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };
  const handleQueryChange = () => {
    handleSearch();
    nextTick(() => {
      createCatalogChunkRequest();
    });
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
    nextTick(() => {
      createCatalogChunkRequest();
    });
  };
  onMounted(() => {
    fetchData();
    nextTick(() => {
      createCatalogChunkRequest();
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
