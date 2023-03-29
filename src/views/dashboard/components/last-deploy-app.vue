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
          data-index="instance.name"
          :title="$t('dashboard.table.instance')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="instance.application.project.name"
          :title="$t('dashboard.table.project')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="instance.application.name"
          :title="$t('dashboard.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="time"
          :title="$t('dashboard.table.time')"
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
          :title="$t('dashboard.table.duration')"
        >
          <template #cell="{ record }">
            <span>{{ setDurationValue(record.duration) }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="status"
          :title="$t('dashboard.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :color="get(statusColorMap, toLower(record.status))"
              :status="record.status"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="environment.name"
          :title="$t('dashboard.table.envrionment')"
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
  import { toLower, get } from 'lodash';
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
      name: 'ApplicationsDetail',
      query: { id: row.id }
    });
  };
  const setDurationValue = (val) => {
    if (!val) return '-';
    const seconds = val % 60;
    const min = Math.floor(val / 60);
    return `${min}'${seconds}"`;
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
