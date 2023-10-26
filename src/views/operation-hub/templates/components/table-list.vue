<template>
  <ComCard borderless padding="0" class="projects">
    <div class="content">
      <FilterBox>
        <template #params>
          <a-select
            v-model="queryParams.catalogID"
            allow-clear
            allow-search
            style="width: 240px"
            :options="catalogList"
            :placeholder="$t('operation.templates.catalogId.holder')"
            @clear="handleSearch"
            @change="handleSearch"
            @press-enter="handleSearch"
          >
          </a-select>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 240px"
            :placeholder="$t('operation.templates.table.holder')"
            @clear="handleSearch"
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
            v-if="scope === 'global'"
            v-permission="{
              resource: `roles.${Resources.TemplateCompletions}`,
              actions: [Actions.POST]
            }"
            type="primary"
            @click="handleDraftModule"
          >
            <template #icon>
              <icon-font type="icon-ChatGPT"></icon-font>
            </template>
            <span>{{ $t('operation.templates.button.gpt') }}</span>
          </a-button>
          <a-button
            v-if="
              route.params.projectId
                ? userStore.hasProjectResourceActions({
                    resource: Resources.Templates,
                    projectID: route.params.projectId,
                    actions: [Actions.POST]
                  })
                : userStore.hasRolesActionsPermission({
                    resource: Resources.Templates,
                    actions: [Actions.POST]
                  })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('operation.templates.detail.add') }}</a-button
          >

          <a-button
            v-if="
              route.params.projectId
                ? userStore.hasProjectResourceActions({
                    resource: Resources.Templates,
                    projectID: route.params.projectId,
                    actions: [Actions.DELETE]
                  })
                : userStore.hasRolesActionsPermission({
                    resource: Resources.Templates,
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
      <a-divider :margin="8"></a-divider>
      <a-spin :loading="loading" class="fill-width">
        <a-tabs
          lazy-load
          default-active-key="currentView"
          :active-key="currentView"
        >
          <a-tab-pane key="thumb">
            <ThumbView
              :scope="scope"
              :list="dataList"
              :catalog-list="catalogList"
              :checked-list="selectedKeys"
              :show-checkbox="
                route.params.projectId
                  ? userStore.hasProjectResourceActions({
                      resource: Resources.Templates,
                      projectID: route.params.projectId,
                      actions: [Actions.DELETE]
                    })
                  : userStore.hasRolesActionsPermission({
                      resource: Resources.Templates,
                      actions: [Actions.DELETE]
                    })
              "
              @change="handleCheckChange"
            ></ThumbView>
          </a-tab-pane>
          <a-tab-pane key="list">
            <ListView
              ref="listViewRef"
              v-model:sort="sort"
              v-model:selectedList="selectedKeys"
              :scope="scope"
              :list="dataList"
              :catalog-list="catalogList"
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB, PROJECT } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import _, { map, pickBy, remove } from 'lodash';
  import { ref, reactive, onMounted, nextTick, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { PageAction } from '@/views/config';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { queryCatalogs, CatalogAPI } from '../../catalogs/api';
  import ThumbView from './thumb-view.vue';
  import ListView from './list-view.vue';
  import { TemplateRowData } from '../config/interface';
  import {
    queryTemplates,
    deleteTemplates,
    TEMPLATE_API,
    PROJECT_API_PREFIX
  } from '../api';

  const props = defineProps({
    currentView: {
      type: String,
      default: 'thumb'
    },
    scope: {
      type: String as PropType<'project' | 'global'>,
      default() {
        return 'global';
      }
    }
  });
  let timer: any = null;
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const { setChunkRequest: setCatalogChunkRequest } = useSetChunkRequest();
  const { router, route, t } = useCallCommon();
  const loading = ref(false);
  const selectedKeys = ref<string[]>([]);
  const sort = ref<string[]>(['-createTime']);
  const dataList = ref<TemplateRowData[]>([]);
  const catalogs = ref<
    { label: string; value: string; id: string; name: string }[]
  >([]);
  const listViewRef = ref();
  const total = ref(0);
  const queryParams = reactive({
    query: '',
    catalogID: '',
    nonCatalog: false,
    page: 1,
    perPage: appStore.perPage || 10
  });

  const catalogList = computed(() => {
    return [
      ...catalogs.value,
      {
        label: t('operation.templates.table.noncatalog'),
        value: 'nonCatalog',
        id: 'nonCatalog',
        name: t('operation.templates.table.noncatalog')
      }
    ];
  });
  const query = computed(() => {
    const res = _.cloneDeep(queryParams);
    if (res.catalogID === 'nonCatalog') {
      res.catalogID = '';
      res.nonCatalog = true;
    }
    return res;
  });
  const { updateChunkedList } = useUpdateChunkedList(dataList);
  const { updateChunkedList: updateCatalogList } = useUpdateChunkedList(
    catalogs,
    {
      callback: (list) => {
        catalogs.value = _.map(list, (o) => {
          const item = _.cloneDeep(o);
          return {
            label: item.name,
            value: item.id,
            id: item.id,
            name: item.name
          };
        });
      }
    }
  );

  const handleCreate = () => {
    if (props.scope === 'project') {
      router.push({
        name: PROJECT.TemplateDetail,
        params: {
          projectId: route.params.projectId,
          action: PageAction.EDIT
        }
      });
      return;
    }
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      params: {
        action: PageAction.EDIT
      }
    });
  };
  const handleDraftModule = () => {
    router.push({
      name: OPERATIONHUB.TemplateGPT
    });
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(query.value, (val) => !!val),
        sort: [sort.value]
      };
      const { data } = await queryTemplates(params);
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
          id: val as string
        };
      });
      await deleteTemplates({ items: ids });
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
    if (!dataList.value.length) {
      queryParams.page = 1;
      handleFilter();
    }
  };

  const createTemplateChunkRequest = () => {
    let url = TEMPLATE_API;
    if (props.scope === 'project') {
      url = `${PROJECT_API_PREFIX()}${TEMPLATE_API}`;
    }
    try {
      setChunkRequest({
        url,
        params: {
          ..._.pickBy(_.omit(query.value, ['page', 'perPage']), (val) => !!val)
        },
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };

  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
    nextTick(() => {
      createTemplateChunkRequest();
    });
  };

  const updateCatalogHandler = (list) => {
    _.each(list, (data) => {
      updateCatalogList(data);
    });

    if (query.value.catalogID) {
      const catalog = _.find(catalogList.value, {
        value: query.value.catalogID
      });
      if (!catalog) {
        queryParams.catalogID = '';
        handleSearch();
      }
    }
  };

  const createCatalogChunkRequest = () => {
    let url = CatalogAPI;
    if (props.scope === 'project') {
      url = `${PROJECT_API_PREFIX()}${CatalogAPI}`;
    }
    try {
      setCatalogChunkRequest({
        url,
        handler: updateCatalogHandler
      });
    } catch (error) {
      // ignore
    }
  };
  const handleReset = () => {
    queryParams.query = '';
    queryParams.catalogID = '';
    queryParams.page = 1;
    handleFilter();
    nextTick(() => {
      createTemplateChunkRequest();
    });
  };

  const getCatalogList = async () => {
    try {
      const params = {
        page: -1,
        extract: ['-status', '-sync']
      };
      const { data } = await queryCatalogs(params);
      catalogs.value = _.map(data?.items || [], (item) => {
        return {
          label: item.name,
          value: item.id,
          id: item.id,
          name: item.name
        };
      });
    } catch (error) {
      // ignore
    }
  };
  onMounted(() => {
    fetchData();
    getCatalogList();
    nextTick(() => {
      createTemplateChunkRequest();
      createCatalogChunkRequest();
    });
  });
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
