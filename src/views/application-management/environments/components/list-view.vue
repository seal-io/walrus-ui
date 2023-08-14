<template>
  <div class="list-view-wrap">
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelection"
      @sorter-change="handleSortChange"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('operation.environments.table.env')"
        >
          <template #cell="{ record }">
            <a-link type="text" size="small" @click="handleView(record)">
              {{ record.name }}
            </a-link>
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
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-tooltip
              v-if="
                userStore.hasRolesActionsPermission({
                  resource: Resources.Environments,
                  actions: ['PUT']
                })
              "
              :content="$t('common.button.edit')"
            >
              <a-link type="text" size="small" @click="handleEdit(record)">
                <template #icon><icon-edit class="size-14" /></template>
              </a-link>
            </a-tooltip>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { PageAction } from '@/views/config';
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { PropType, watchEffect } from 'vue';
  import dayjs from 'dayjs';
  import useRowSelect from '@/hooks/use-row-select';
  import useCallCommon from '@/hooks/use-call-common';
  import { UseSortDirection } from '@/utils/common';
  import { EnvironmentRow } from '../config/interface';

  const props = defineProps({
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    list: {
      type: Array as PropType<EnvironmentRow[]>,
      default() {
        return [];
      }
    },
    selectedList: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    }
  });
  const userStore = useUserStore();
  type BaseType = string | number;
  let timer: any = null;
  const emits = defineEmits(['update:selectedList', 'sort', 'update:sort']);
  const { router, route } = useCallCommon();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const { rowSelection, selectedKeys } = useRowSelect();
  const handleSelectChange = (list: BaseType[]) => {
    rowSelection.selectedRowKeys = [...list];
    setTimeout(() => {
      emits('update:selectedList', list);
    }, 100);
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    emits('update:sort', sort.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      emits('sort');
    }, 100);
  };
  const handleEdit = (row) => {
    router.push({
      name: 'EnvironmentDetail',
      params: {
        action: PageAction.EDIT
      },
      query: { id: row.id }
    });
  };
  const handleView = (row) => {
    router.push({
      name: 'ProjectEnvDetail',
      params: {
        action: PageAction.VIEW,
        ...route.params,
        environmentId: row.id
      }
    });
  };
  watchEffect(() => {
    rowSelection.selectedRowKeys = [].concat(props.selectedList as never[]);
  });
</script>

<style></style>
