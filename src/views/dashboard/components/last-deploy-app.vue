<template>
  <div class="list-view-wrap">
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :data="list"
      :pagination="false"
      @cell-click="handleCellClick"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="resource.name"
          :title="title"
          :body-cell-class="
            (record) => {
              return userStore.hasProjectResourceActions({
                resource: Resources.Resources,
                projectID: record.project?.id,
                actions: [Actions.GET]
              })
                ? 'clickable'
                : '';
            }
          "
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasProjectResourceActions({
                  resource: Resources.Resources,
                  projectID: record.project?.id,
                  actions: [Actions.GET]
                })
              "
              :hoverable="false"
              >{{ record?.resource?.name || '' }}</a-link
            >
            <span v-else>{{ record?.resource?.name || '' }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="project.name"
          :title="$t('dashboard.table.project')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="environment.name"
          :title="$t('dashboard.table.envrionment')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="left"
          data-index="createTime"
          :title="$t('common.table.createTime')"
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
          align="left"
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
              :color="
                get(statusColorMap, toLower(record.status?.summaryStatus))
              "
              :status="record.status?.summaryStatus"
            ></StatusLabel>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { setDurationValue } from '@/views/config/utils';
  import _, { toLower, get } from 'lodash';
  import dayjs from 'dayjs';
  import { PropType } from 'vue';
  import { useUserStore, useProjectStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import { ServiceDataType } from '@/views/application-management/services/config';
  import StatusLabel from './status-label.vue';
  import { statusColorMap } from '../config';

  const props = defineProps({
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    type: {
      type: String,
      default() {
        return ServiceDataType.service;
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
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const handleToDetail = async (row) => {
    router.push({
      name: PROJECT.ServiceDetail,
      params: {
        projectId: _.get(row, 'project.id'),
        environmentId: _.get(row, 'environment.id'),
        dataType: props.type
      },
      query: {
        id: _.get(row, 'resource.id'),
        from: 'dashboard'
      }
    });
  };

  const handleCellClick = (row, col) => {
    if (
      col.dataIndex === 'resource.name' &&
      userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        projectID: row.project?.id,
        actions: [Actions.GET]
      })
    ) {
      handleToDetail(row);
    }
  };
</script>

<style lang="less" scoped>
  .list-view-wrap {
    :deep(.arco-table) {
      .arco-table-th {
        line-height: 2.5;
        background-color: rgba(230, 244, 254, 0.5);
      }

      .arco-table-td {
        font-weight: var(--font-weight-medium);
      }
    }
  }
</style>
