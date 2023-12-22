<template>
  <comCard borderless padding="0">
    <div class="connectors-list">
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #params>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 200px"
            :placeholder="$t('common.search.name.placeholder')"
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
        <template
          v-if="
            [scopeMap.ENVIRONMENT, scopeMap.GLOBAL, scopeMap.PROJECT].includes(
              scope
            )
          "
          #button-group
        >
          <a-button
            v-if="
              scope === scopeMap.GLOBAL
                ? userStore.hasRolesActionsPermission({
                    resource: Resources.Variables,
                    actions: [Actions.POST]
                  })
                : userStore.hasProjectResourceActions({
                    projectID: route.params.projectId,
                    environmentID:
                      scope === scopeMap.PROJECT ? '' : environmentId,
                    resource: Resources.Variables,
                    actions: [Actions.POST]
                  })
            "
            type="primary"
            @click="handleCreate"
            >{{ $t('applications.secret.create') }}</a-button
          >
          <a-button
            v-if="
              scope === scopeMap.GLOBAL
                ? userStore.hasRolesActionsPermission({
                    resource: Resources.Variables,
                    actions: [Actions.DELETE]
                  })
                : userStore.hasProjectResourceActions({
                    projectID: route.params.projectId,
                    environmentID:
                      scope === scopeMap.PROJECT ? '' : environmentId,
                    resource: Resources.Variables,
                    actions: [Actions.DELETE]
                  })
            "
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
        row-key="id"
        :row-selection="
          userStore.isReadOnlyEnvironment(
            route.params.projectId,
            route.params.environmentId
          )
            ? null
            : rowSelectionStatue
        "
        @sorter-change="handleSortChange"
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="name"
            :title="
              $t('common.table.name.list', {
                type: $t('applications.applications.secret')
              })
            "
            :sortable="{
              sortDirections: ['ascend', 'descend'],
              defaultSortOrder: '',
              sorter: true,
              sortOrder: sortDataIndex === 'name' ? sortOrder : ''
            }"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="scope"
            :title="$t('applications.applications.secret.scope')"
          >
            <template #cell="{ record }">
              <span>{{ $t(showScope(record)) }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            align="left"
            :cell-style="{ minWidth: '40px' }"
            data-index="value"
            :title="$t('applications.applications.secret.value')"
          >
            <template #cell="{ record }">
              <span v-if="record.sensitive">
                <icon-lock />
              </span>
              <span v-else>
                {{ !record.sensitive ? record.value : '*******' }}
              </span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="description"
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
            v-if="
              scope === scopeMap.GLOBAL
                ? userStore.hasRolesActionsPermission({
                    resource: Resources.Variables,
                    actions: [Actions.PUT]
                  })
                : userStore.hasProjectResourceActions({
                    projectID: route.params.projectId,
                    environmentID:
                      scope === scopeMap.PROJECT ? '' : environmentId,
                    resource: Resources.Variables,
                    actions: [Actions.PUT]
                  })
            "
            align="left"
            :width="210"
            :title="$t('common.table.operation')"
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
          >
            <template #cell="{ record }">
              <DropButtonGroup
                v-if="setActionList(record).length"
                :layout="
                  setActionList(record).length === 1 ? 'horizontal' : 'vertical'
                "
                :actions="setActionList(record)"
                @select="(value) => handleClickAction(value, record)"
              ></DropButtonGroup>
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
        :hide-on-single-page="total <= 10"
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
    <createVariable
      v-model:show="showModal"
      :title="modalTitle"
      :action="action"
      :info="itemInfo"
      :project="projectId"
      :environment="environmentId"
      @save="handleSaveItem"
    ></createVariable>
  </comCard>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import dayjs from 'dayjs';
  import _, { cloneDeep, map, pickBy } from 'lodash';
  import { reactive, ref, onMounted, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import { VariableRow } from '../config/interface';
  import { queryVariables, deleteVariable } from '../api';
  import createVariable from './create-variable.vue';
  import { actionList } from '../config';

  const scopeMap = {
    PROJECT: 'project',
    GLOBAL: 'global',
    ENVIRONMENT: 'environment',
    SERVICE: 'service'
  };

  const props = defineProps({
    scope: {
      type: String as PropType<
        'project' | 'global' | 'environment' | 'service'
      >,
      default() {
        return '';
      }
    }
  });
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t, route } = useCallCommon();
  const { sort, sortOrder, sortDataIndex, setSortDirection } = UseSortDirection(
    {
      defaultSortField: '-createTime',
      defaultOrder: 'descend'
    }
  );
  let timer: any = null;
  const loading = ref(false);
  const showModal = ref(false);
  const itemInfo = ref<any>({});
  const action = ref<'create' | 'edit'>('create');
  const total = ref(0);
  const projectId = route.params.projectId as string;
  const environmentId = route.params.environmentId as string;
  const scopeParams = reactive({
    project: {
      includeInherited: true
    },
    environment: {
      includeInherited: true
    },
    service: {
      includeInherited: true
    },
    global: {}
  });
  const queryParams = reactive({
    query: '',
    page: 1,
    perPage: appStore.perPage || 10
  });
  const dataList = ref<VariableRow[]>([]);

  const modalTitle = computed(() => {
    if (action.value === 'create') {
      return t('applications.secret.create');
    }
    return t('applications.secret.edit');
  });

  const visibleInScope = (row) => {
    if (props.scope === scopeMap.PROJECT) {
      return _.get(row, 'project.id') && !_.get(row, 'environment.id');
    }
    if (props.scope === scopeMap.ENVIRONMENT) {
      return _.get(row, 'project.id') && _.get(row, 'environment.id');
    }
    return !_.get(row, 'project.id') && !_.get(row, 'environment.id');
  };

  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return visibleInScope(row);
    });
    // const res = _.map(list, (o) => {
    //   const item = _.cloneDeep(o);
    //   item.disabled = _.isFunction(item.disabled)
    //     ? item.disabled?.(row)
    //     : item.disabled;

    //   return item;
    // });
    return list;
  };
  const rowSelectionStatue = computed(() => {
    if (props.scope === scopeMap.GLOBAL) {
      return userStore.hasRolesActionsPermission({
        resource: Resources.Variables,
        actions: [Actions.PUT]
      })
        ? rowSelection
        : null;
    }
    return rowSelection;
  });

  const showScope = (row) => {
    if (_.get(row, 'project.id') && !_.get(row, 'environment.id')) {
      return 'applications.variable.scope.project';
    }
    if (_.get(row, 'project.id') && _.get(row, 'environment.id')) {
      return 'applications.variable.scope.envrionment';
    }
    return 'applications.variable.scope.global';
  };
  const getScope = (row) => {
    if (_.get(row, 'project.id') && !_.get(row, 'environment.id')) {
      return scopeMap.PROJECT;
    }
    if (_.get(row, 'project.id') && _.get(row, 'environment.id')) {
      return scopeMap.ENVIRONMENT;
    }
    return scopeMap.GLOBAL;
  };
  const handleToggleVal = (row) => {
    row.visible = !row.visible;
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val),
        ..._.get(scopeParams, props.scope),
        sort: [sort.value]
      };
      const { data } = await queryVariables(params);
      dataList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          visible: false,
          disabled: [scopeMap.ENVIRONMENT, scopeMap.SERVICE]
            ? getScope(item) !== props.scope ||
              !userStore.hasProjectResourceActions({
                projectID: route.params.projectId,
                environmentID: environmentId,
                resource: Resources.Variables,
                actions: [Actions.PUT]
              })
            : getScope(item) !== props.scope
        };
      });
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    fetchData();
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
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };
  const handleCreate = () => {
    itemInfo.value = {};
    action.value = 'create';
    setTimeout(() => {
      showModal.value = true;
    }, 100);
  };
  const handleDeleteConfirm = async (delList?: string[]) => {
    try {
      loading.value = true;
      const ids = map(delList || selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteVariable({
        data: { items: ids }
      });
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

  const handleClickEdit = (row) => {
    itemInfo.value = cloneDeep(row);
    action.value = 'edit';
    setTimeout(() => {
      showModal.value = true;
    }, 100);
  };

  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };

  const handleClickAction = (value, row) => {
    switch (value) {
      case 'edit':
        handleClickEdit(row);
        break;
      case 'delete':
        handleDelete([row.id]);
        break;
      default:
        break;
    }
  };
  const handleSaveItem = () => {
    queryParams.page = 1;
    handleFilter();
  };
  onMounted(async () => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .connectors-list {
    :deep(.arco-table) {
      .visible {
        padding-bottom: 3px;
      }

      .invisible {
        padding-top: 2px;
      }
    }
  }
</style>
