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
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" :href="handleEdit(record)">
                <template #icon><icon-edit /></template>
                {{ $t('common.button.edit') }}
              </a-link>
              <a-link type="text" size="small" :href="handleView(record)">
                <template #icon><icon-list style="font-size: 16px" /></template>
                {{ $t('common.button.detail') }}
              </a-link>
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
  import { ProjectItem } from '../config/interface';

  const props = defineProps({
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    list: {
      type: Array as PropType<ProjectItem[]>,
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
  const emits = defineEmits(['update:selectedList']);
  const { router } = useCallCommon();
  const { rowSelection, selectedKeys } = useRowSelect();
  const handleSelectChange = (list: BaseType[]) => {
    rowSelection.selectedRowKeys = [...list];
    setTimeout(() => {
      emits('update:selectedList', list);
    }, 100);
  };
  const handleEdit = (row) => {
    const path = router.resolve({
      name: 'applicationsList',
      query: { id: row.id }
    });
    return path.href;
  };
  const handleView = (row) => {
    const path = router.resolve({
      name: 'applicationsList',
      query: { id: row.id }
    });
    return path.href;
  };
  watchEffect(() => {
    rowSelection.selectedKeys = [].concat(props.selectedList as never[]);
  });
</script>

<style></style>
