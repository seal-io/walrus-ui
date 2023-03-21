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
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('applications.projects.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{ record.createTime }}</span>
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
          align="center"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  type="text"
                  size="small"
                  @click="handleEditProject(record)"
                >
                  <template #icon><icon-edit class="size-16" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.detail')">
                <a-link type="text" size="small" @click="handleEdit(record)">
                  <template #icon><icon-list class="size-16" /></template>
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
  import { PropType, watchEffect } from 'vue';
  import useRowSelect from '@/hooks/use-row-select';
  import useCallCommon from '@/hooks/use-call-common';
  import { ProjectRowData } from '../config/interface';

  const props = defineProps({
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    list: {
      type: Array as PropType<ProjectRowData[]>,
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
  type BaseType = string | number;
  const emits = defineEmits(['update:selectedList', 'edit']);
  const { router } = useCallCommon();
  const { rowSelection, selectedKeys } = useRowSelect();
  const handleSelectChange = (list: BaseType[]) => {
    rowSelection.selectedRowKeys = [...list];
    setTimeout(() => {
      emits('update:selectedList', list);
    }, 100);
  };
  const handleEdit = (row) => {
    const path = router.push({
      name: 'applicationsDetail',
      query: { id: row.id }
    });
  };
  const handleEditProject = (row) => {
    emits('edit', row);
  };
  watchEffect(() => {
    rowSelection.selectedRowKeys = [].concat(props.selectedList as never[]);
  });
</script>

<style></style>
