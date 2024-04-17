<template>
  <comCard borderless padding="0">
    <div class="connectors-list">
      <FilterBox style="margin-bottom: var(--filter-box-margin)">
        <template #params>
          <a-input
            v-model.trim="queryParams.fieldSelector"
            allow-clear
            style="width: 220px"
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
        <template
          v-if="
            [
              VariableScope.ENVIRONMENT,
              VariableScope.SYSTEM,
              VariableScope.PROJECT
            ].includes(scope)
          "
          #button-group
        >
          <a-button
            v-if="hasPutPermission"
            type="primary"
            @click="handleCreate"
            >{{ $t('applications.secret.create') }}</a-button
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
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :bordered="false"
        :loading="loading"
        :data="dataList"
        :pagination="false"
        row-key="metadataName"
        :row-selection="hasDeletePermission ? rowSelectionStatue : null"
        @sorter-change="handleSortChange"
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="metadata.name"
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
                {{ !record.spec.sensitive ? record.status.value : '*******' }}
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
            v-if="hasPutPermission"
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
        <template #empty>
          <result-view
            :loading="loading"
            :title="
              queryParams.fieldSelector
                ? $t('common.result.nodata.title', {
                    type: $t('applications.applications.secret')
                  })
                : $t('common.nodata.created', {
                    type: $t('applications.applications.secret')
                  })
            "
            :subtitle="
              queryParams.fieldSelector
                ? $t('common.result.nodata.subtitle')
                : ''
            "
          >
            <template #icon>
              <icon-find-replace v-if="queryParams.fieldSelector" />
              <i
                v-else
                class="iconfont icon-variable"
                style="font-weight: 500; font-size: 24px"
              ></i>
            </template>
            <template #extra>
              <a-button
                v-if="hasPutPermission && !queryParams.fieldSelector"
                type="outline"
                @click="handleCreate"
                ><icon-plus class="m-r-4" />{{
                  $t('common.button.create.now')
                }}</a-button
              >
            </template>
          </result-view>
        </template>
      </a-table>
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
    <createVariable
      v-model:show="showModal"
      :title="modalTitle"
      :action="action"
      :info="itemInfo"
      :namespace="queryParams.namespace"
      :scope="scope"
      :project="projectName"
      :environment="environmentName"
      @save="handleSaveItem"
    ></createVariable>
  </comCard>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useAppStore } from '@/store';
  import dayjs from 'dayjs';
  import { handleBatchRequest } from '@/views/config/utils';
  import _, { cloneDeep, map, pickBy } from 'lodash';
  import { reactive, ref, onMounted, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import { VariableRow, VariableScopeType } from '../config/interface';
  import { queryVariables, deleteVariable, GlobalNamespace } from '../api';
  import createVariable from './create-variable.vue';
  import { actionList, VariableScope } from '../config';

  const props = defineProps({
    scope: {
      type: String as PropType<VariableScopeType>,
      required: true,
      default() {
        return VariableScope.ENVIRONMENT;
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
  const projectName = route.params.projectName as string;
  const environmentName = route.params.environmentName as string;

  const scopeParams = reactive({
    [VariableScope.PROJECT]: {
      includeInherited: true
    },
    [VariableScope.ENVIRONMENT]: {
      includeInherited: true
    },
    [VariableScope.SERVICE]: {
      includeInherited: true
    },
    [VariableScope.SYSTEM]: {}
  });
  const queryParams = reactive({
    fieldSelector: '',
    namespace: environmentName || projectName || GlobalNamespace
  });
  const dataList = ref<VariableRow[]>([]);

  const hasPutPermission = computed(() => {
    return props.scope === VariableScope.SYSTEM
      ? userStore.hasRolesActionsPermission({
          resource: Resources.Variables,
          actions: [Actions.PUT]
        })
      : userStore.hasProjectResourceActions({
          projectID: projectName,
          environmentID:
            props.scope === VariableScope.PROJECT ? '' : environmentName,
          resource: Resources.Variables,
          actions: [Actions.PUT]
        });
  });
  const hasDeletePermission = computed(() => {
    return props.scope === VariableScope.SYSTEM
      ? userStore.hasRolesActionsPermission({
          resource: Resources.Variables,
          actions: [Actions.DELETE]
        })
      : userStore.hasProjectResourceActions({
          projectID: projectName,
          environmentID:
            props.scope === VariableScope.PROJECT ? '' : environmentName,
          resource: Resources.Variables,
          actions: [Actions.DELETE]
        });
  });
  const modalTitle = computed(() => {
    if (action.value === 'create') {
      return t('applications.secret.create');
    }
    return t('applications.secret.edit');
  });

  const visibleInScope = (row) => {
    return row.status?.scope === props.scope;
  };

  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return visibleInScope(row);
    });

    return list;
  };
  const rowSelectionStatue = computed(() => {
    if (props.scope === VariableScope.SYSTEM) {
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
    if (row.status?.scope === VariableScope.PROJECT) {
      return 'applications.variable.scope.project';
    }
    if (row.status?.scope === VariableScope.ENVIRONMENT) {
      return 'applications.variable.scope.envrionment';
    }
    return 'applications.variable.scope.global';
  };
  const getScope = (row) => {
    return row.status?.scope;
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
          metadataName: item.metadata?.name,
          disabled: [VariableScope.ENVIRONMENT, VariableScope.SERVICE]
            ? getScope(item) !== props.scope ||
              !userStore.hasProjectResourceActions({
                projectID: projectName,
                environmentID: environmentName,
                resource: Resources.Variables,
                actions: [Actions.PUT]
              })
            : getScope(item) !== props.scope
        };
      });
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
      // queryParams.page = 1;
      handleFilter();
    }, 100);
  };

  const handleReset = () => {
    // queryParams.query = '';
    // queryParams.page = 1;
    handleFilter();
  };
  const handlePageChange = (page: number) => {
    // queryParams.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    // queryParams.page = 1;
    // queryParams.perPage = pageSize;
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
  const handleDeleteConfirm = async (names?: string[]) => {
    try {
      loading.value = true;
      const nameList = map(names || selectedKeys.value, (val) => {
        return {
          name: val,
          namespace: queryParams.namespace
        };
      });
      await handleBatchRequest(nameList, deleteVariable);
      loading.value = false;
      execSucceed();
      // queryParams.page = 1;
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

  const handleDelete = async (names?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(names) });
  };

  const handleClickAction = (value, row) => {
    switch (value) {
      case 'edit':
        handleClickEdit(row);
        break;
      case 'delete':
        handleDelete([row.metadata.name]);
        break;
      default:
        break;
    }
  };
  const handleSaveItem = () => {
    // queryParams.page = 1;
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
