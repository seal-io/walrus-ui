<template>
  <div class="workflows-list">
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelectionRef"
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('operation.templates.table.name')"
        >
          <template #cell="{ record }">
            <span>
              <i
                v-if="_.get(record, ['labels', 'walrus.seal.io/category'])"
                class="iconfont icon-shandian"
                style="color: var(--seal-color-success)"
              ></i>
              <a-link size="small" @click="handleView(record)">{{
                record.name
              }}</a-link>
            </span>
          </template>
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
          data-index="status"
          :title="$t('applications.applications.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :zoom="0.9"
              :status="{
                status: get(record, 'status.summaryStatus'),
                text: get(record, 'status.summaryStatus'),
                message: get(record, 'status.summaryStatusMessage'),
                transitioning: get(record, 'status.transitioning'),
                error: get(record, 'status.error')
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
            sorter: true,
            sortOrder: sortOrder
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
          v-if="
            route.params.projectId
              ? userStore.hasProjectResourceActions({
                  resource: Resources.Templates,
                  projectID: route.params.projectId,
                  actions: [Actions.PUT]
                })
              : userStore.hasRolesActionsPermission({
                  resource: Resources.Templates,
                  actions: [Actions.PUT]
                })
          "
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="16">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  v-if="!_.get(record, 'catalog.id')"
                  type="text"
                  size="small"
                  @click="handleEdit(record)"
                >
                  <template #icon><icon-edit class="size-14" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.refresh')">
                <a-link type="text" size="small" @click="handlRefresh(record)">
                  <template #icon><icon-refresh /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip
                :content="
                  _.get(record, ['labels', 'walrus.seal.io/category']) ===
                  'service'
                    ? $t('operation.templates.button.cancelUseInService')
                    : $t('operation.templates.button.useInservice')
                "
              >
                <a-link
                  type="text"
                  size="small"
                  @click="handleToggleAvailable(record)"
                >
                  <template #icon>
                    <i class="iconfont icon-shandian"></i>
                  </template>
                </a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB, PROJECT } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { PageAction } from '@/views/config';
  import { useUserStore } from '@/store';
  import _, { map, get } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted, PropType, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { UseSortDirection } from '@/utils/common';
  import { TemplateRowData } from '../config/interface';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import {
    queryTemplates,
    updateTemplate,
    refreshTemplate,
    deleteTemplates
  } from '../api';

  const props = defineProps({
    list: {
      type: Array as PropType<TemplateRowData[]>,
      default() {
        return [];
      }
    },
    selectedList: {
      type: Array as PropType<Array<string | number>>,
      default() {
        return [];
      }
    },
    catalogList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },
    scope: {
      type: String as PropType<'project' | 'global'>,
      default() {
        return 'global';
      }
    }
  });
  type BaseType = string | number;
  const userStore = useUserStore();
  const emits = defineEmits(['update:selectedList', 'update:sort', 'sort']);
  const { rowSelection, selectedKeys } = useRowSelect();
  const { router, route } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  let timer: any = null;
  const loading = ref(false);
  const total = ref(100);
  const queryParams = reactive({
    // type: '',
    id: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<TemplateRowData[]>([]);

  const rowSelectionRef = computed(() => {
    if (route.params.projectId) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Templates,
        projectID: route.params.projectId,
        actions: [Actions.DELETE]
      })
        ? rowSelection
        : null;
    }
    return userStore.hasRolesActionsPermission({
      resource: Resources.Templates,
      actions: [Actions.DELETE]
    })
      ? rowSelection
      : null;
  });
  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await queryTemplates({
        ...queryParams,
        sort: [sort.value]
      });
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    emits('update:sort', sort.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      emits('sort');
    }, 100);
    // fetchData();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.id = '';
    queryParams.page = 1;
    handleFilter();
  };
  const handleSelectChange = (list: BaseType[]) => {
    rowSelection.selectedRowKeys = [...list];
    setTimeout(() => {
      emits('update:selectedList', list);
    }, 100);
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
          id: val as string
        };
      });
      await deleteTemplates({ items: ids });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      loading.value = false;
    }
  };

  const getCatalogName = (id) => {
    const catalog = _.find(props.catalogList, (item) => {
      return item.value === id;
    });
    return catalog?.label;
  };

  const handleEdit = (row) => {
    let routeName = OPERATIONHUB.TemplateDetail;
    let params: any = { action: PageAction.EDIT };
    if (props.scope === 'project') {
      routeName = PROJECT.TemplateDetail;
      params = {
        action: PageAction.EDIT,
        projectId: route.params.projectId as string
      };
    }
    router.push({
      name: routeName,
      params,
      query: {
        id: row.id,
        catalog: getCatalogName(row.catalog?.id)
      }
    });
  };

  const handleView = (row) => {
    let routeName = OPERATIONHUB.TemplateDetail;
    let params: any = { action: PageAction.VIEW };
    if (props.scope === 'project') {
      routeName = PROJECT.TemplateDetail;
      params = {
        action: PageAction.VIEW,
        projectId: route.params.projectId as string
      };
    }
    router.push({
      name: routeName,
      params,
      query: {
        id: row.id,
        catalog: getCatalogName(row.catalog?.id)
      }
    });
  };
  const handlRefresh = async (row) => {
    try {
      await refreshTemplate({ id: row.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleToggleAvailable = async (row) => {
    try {
      const data = {
        ...row,
        labels: {
          'walrus.seal.io/category':
            _.get(row, ['labels', 'walrus.seal.io/category']) === 'service'
              ? ''
              : 'service'
        }
      };
      await updateTemplate(data);
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const clearSelection = () => {
    selectedKeys.value = [];
    rowSelection.selectedRowKeys = [];
  };
  defineExpose({
    clearSelection
  });
</script>

<style lang="less" scoped></style>
