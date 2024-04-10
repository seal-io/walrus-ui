<template>
  <ComCard borderless padding="0" class="projects">
    <div class="content">
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
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
            v-model.trim="queryParams.labelSelector"
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
            v-if="hasPutPermission"
            type="primary"
            @click="handleCreate"
            >{{ $t('operation.templates.detail.add') }}</a-button
          >

          <a-button
            v-if="hasDeletePermission"
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
      <div class="pagination">
        <a-space class="sort" :size="20">
          <a-checkbox
            v-if="hasDeletePermission"
            :model-value="
              selectedKeys.length >= dataList.length && dataList.length > 0
            "
            :indeterminate="
              selectedKeys.length > 0 && selectedKeys.length < dataList.length
            "
            @change="handleSelectAll"
          ></a-checkbox>
          <a-button
            type="text"
            size="mini"
            :class="{ active: sortDataIndex === 'name' }"
            @click="handleNameSort"
          >
            <i class="iconfont icon-sort size-16" style="stroke-width: 4"></i>
          </a-button>
          <a-button
            type="text"
            size="mini"
            :class="{ active: sortDataIndex === 'createTime' }"
            @click="handleTimeSort"
          >
            <i class="iconfont icon-Field-time size-16"></i>
          </a-button>
        </a-space>
        <!-- <a-pagination
          size="small"
          :total="total"
          :page-size="queryParams.perPage"
          :current="queryParams.page"
          show-total
          show-page-size
          :hide-on-single-page="total <= 10"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        /> -->
      </div>
      <a-spin :loading="loading" class="fill-width">
        <a-tabs
          lazy-load
          default-active-key="currentView"
          :active-key="currentView"
        >
          <a-tab-pane key="thumb">
            <ThumbView
              :scope="scope"
              :loading="loading"
              :list="dataList"
              :catalog-list="catalogList"
              :checked-list="selectedKeys"
              :show-checkbox="hasDeletePermission"
              @delete="handleCallDelete"
              @change="handleCheckChange"
            >
              <template #empty>
                <result-view
                  :loading="loading"
                  :title="
                    queryParams.query
                      ? $t('common.result.nodata.title', {
                          type: $t('operation.templates.table.name')
                        })
                      : $t('common.nodata.created', {
                          type: $t('operation.templates.table.name')
                        })
                  "
                  :subtitle="
                    queryParams.query ? $t('common.result.nodata.subtitle') : ''
                  "
                >
                  <template #icon>
                    <icon-find-replace v-if="queryParams.query" />
                    <i
                      v-else
                      class="iconfont icon-layers-2"
                      style="font-size: 18px"
                    ></i>
                  </template>
                  <template #extra>
                    <a-button
                      v-if="hasPutPermission && !queryParams.query"
                      type="outline"
                      @click="handleCreate"
                      ><icon-plus class="m-r-4" />{{
                        $t('common.button.create.now')
                      }}</a-button
                    >
                  </template>
                </result-view>
              </template>
            </ThumbView>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
      <TemplateModal
        v-model:show="showModal"
        v-model:data-info="dataInfo"
        :action="action"
        :title="modalTitle"
        @save="handleSave"
      ></TemplateModal>
    </div>
  </ComCard>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB, PROJECT } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import _, { map, pickBy, remove } from 'lodash';
  import {
    ref,
    reactive,
    onMounted,
    onBeforeUnmount,
    nextTick,
    computed,
    PropType
  } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { UseSortDirection } from '@/utils/common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { deleteModal, execSucceed, batchDelete } from '@/utils/monitor';
  import { PageAction, ModalAction } from '@/views/config';
  import { useUpdateChunkedList } from '@/views/commons/hooks/use-update-chunked-list';
  import { queryCatalogs, CatalogAPI } from '../../catalogs/api';
  import ThumbView from './thumb-view.vue';
  import TemplateModal from './template-modal.vue';
  import { TemplateRowData } from '../config/interface';
  import {
    queryTemplates,
    deleteTemplates,
    TEMPLATE_API,
    PROJECT_API_PREFIX,
    GlobalNamespace,
    NAMESPACES
  } from '../api';
  import {
    listenFilterTemplateAction,
    removeFilterTemplateActionListener
  } from '../../hooks/filter-catalog-listener';

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
  const showModal = ref(false);
  const dataInfo = ref({});
  const modalTitle = ref('Add Template');
  const action = ref(ModalAction.CREATE);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { setChunkRequest } = useSetChunkRequest();
  const { setChunkRequest: setCatalogChunkRequest } = useSetChunkRequest();
  const { router, route, t } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  const projectName = route.params.projectName as string;
  const loading = ref(false);
  const selectedKeys = ref<{ name: string; namespace: string }[]>([]);
  // const sort = ref<string[]>(['-createTime']);
  const dataList = ref<TemplateRowData[]>([]);
  const catalogs = ref<
    { label: string; value: string; id: string; name: string }[]
  >([]);
  const listViewRef = ref();
  const total = ref(0);
  const projectID = route.params.projectId as string;
  const queryParams = reactive({
    labelSelector: '',
    fieldSelector: '',
    limit: 20,
    query: '',
    catalogID: '',
    nonCatalog: false,
    page: '',
    perPage: ''
  });

  const hasPutPermission = computed(() => {
    return projectID
      ? userStore.hasProjectResourceActions({
          resource: Resources.Templates,
          projectID,
          actions: [Actions.POST]
        })
      : userStore.hasRolesActionsPermission({
          resource: Resources.Templates,
          actions: [Actions.POST]
        });
  });

  const hasDeletePermission = computed(() => {
    return projectID
      ? userStore.hasProjectResourceActions({
          resource: Resources.Templates,
          projectID,
          actions: [Actions.DELETE]
        })
      : userStore.hasRolesActionsPermission({
          resource: Resources.Templates,
          actions: [Actions.DELETE]
        });
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
    // showModal.value = true;
    // action.value = ModalAction.CREATE;
    if (props.scope === 'project') {
      router.push({
        name: PROJECT.TemplateDetail,
        params: {
          projectName: route.params.projectName,
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
        sort: [sort.value],
        namespace: props.scope === 'project' ? projectName : GlobalNamespace
      };
      const { data } = await queryTemplates(params);
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item
        };
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
  const handleSelectAll = (checked) => {
    const list = _.map(dataList.value, (item) => {
      return item.metadata.name;
    });
    if (checked) {
      selectedKeys.value = list;
    } else {
      selectedKeys.value = [];
    }
  };
  const handleTimeSort = () => {
    setSortDirection(
      'createTime',
      sortOrder.value === 'ascend' ? 'descend' : 'ascend'
    );
    fetchData();
  };
  const handleNameSort = () => {
    setSortDirection(
      'name',
      sortOrder.value === 'ascend' ? 'descend' : 'ascend'
    );
    fetchData();
  };
  const handleCheckChange = (checked, item) => {
    if (checked) {
      selectedKeys.value.push({
        name: item.metadata.name,
        namespace: item.metadata.namespace
      });
    } else {
      remove(selectedKeys.value, (val) => {
        return (
          val.name === item.metadata.name &&
          val.namespace === item.metadata.namespace
        );
      });
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
  const handleDeleteConfirm = async (
    nameList?: { name: string; namespace: string }[]
  ) => {
    try {
      loading.value = true;
      const nsList = nameList || selectedKeys.value;

      await batchDelete(nsList, deleteTemplates);
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
  const handleDelete = async (nameList?) => {
    deleteModal({ onOk: () => handleDeleteConfirm(nameList) });
  };

  const handleCallDelete = (item) => {
    handleDelete([
      {
        name: item.metadata.name,
        namespace: item.metadata.namespace
      }
    ]);
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

  const handleSave = () => {
    showModal.value = false;
    fetchData();
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

  listenFilterTemplateAction((data) => {
    setTimeout(() => {
      queryParams.catalogID = data.id;
      handleSearch();
    }, 100);
    console.log('template list listenFilterCatalogAction', data);
  });

  onMounted(() => {
    fetchData();
    getCatalogList();
    // nextTick(() => {
    //   createTemplateChunkRequest();
    //   createCatalogChunkRequest();
    // });
  });
  onBeforeUnmount(() => {
    removeFilterTemplateActionListener();
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

    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      padding-right: 0;

      .arco-checkbox {
        padding: 0;

        :deep(.arco-checkbox-icon) {
          border: 1px solid var(--color-border-3);
        }
      }

      .sort {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .arco-btn.active {
        background-color: var(--color-fill-1);
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
