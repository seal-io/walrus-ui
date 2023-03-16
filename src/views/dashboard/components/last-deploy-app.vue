<template>
  <div class="list-view-wrap">
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('Name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="time"
          :title="$t('Time')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="duration"
          :title="$t('Duration')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="status"
          :title="$t('Status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :color="statusColorMap[record.status]"
              :status="record.status"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="env"
          :title="$t('Environment')"
        >
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="assignee"
          :title="$t('Assignee')"
        >
        </a-table-column> -->
        <!-- <a-table-column
          align="center"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
        >
          <template #cell="{ record }">
            <a-space :size="20">
              <a-link type="text" size="small" @click="handleEdit(record)">
                <template #icon><icon-edit /></template>
              </a-link>
            </a-space>
          </template>
        </a-table-column> -->
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import StatusLabel from './status-label.vue';
  import { statusColorMap } from '../config';

  const props = defineProps({
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    list: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  });
  const { router } = useCallCommon();

  const handleEdit = (row) => {
    router.push({
      name: 'applicationsDetail',
      query: { id: row.id }
    });
  };
</script>

<style lang="less" scoped>
  .list-view-wrap {
    :deep(.arco-table) {
      .arco-table-th {
        background-color: rgba(230, 244, 254, 0.5);
      }

      .arco-table-td {
        font-weight: 400;
      }
    }
  }
</style>
