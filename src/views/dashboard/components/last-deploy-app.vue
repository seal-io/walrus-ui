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
          data-index="service.name"
          :title="$t('applications.applications.table.service')"
        >
          <template #cell="{ record }">
            <a-link
              v-if="
                userStore.hasProjectResourceActions({
                  resource: Resources.Services,
                  projectID: record.project?.id,
                  actions: [Actions.GET]
                })
              "
              @click="handleToDetail(record)"
              >{{ record?.service?.name || '' }}</a-link
            >
            <span v-else>{{ record?.service?.name || '' }}</span>
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
          align="center"
          data-index="environment.name"
          :title="$t('dashboard.table.envrionment')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
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
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { USER_DEFAULT_PROJECT } from '@/views/config';
  import localStore from '@/utils/localStore';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import _, { toLower, get } from 'lodash';
  import dayjs from 'dayjs';
  import { PropType } from 'vue';
  import { useUserStore } from '@/store';
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
  const userStore = useUserStore();
  const setDurationValue = (val) => {
    if (!val) return '-';
    const seconds = val % 60;
    const min = Math.floor(val / 60);
    return `${min}'${seconds}"`;
  };
  const handleToDetail = async (row) => {
    await localStore.setValue(USER_DEFAULT_PROJECT, {
      id: _.get(row, 'project.id'),
      name: _.get(row, 'project.name')
    });
    router.push({
      name: PROJECT.ServiceDetail,
      params: {
        projectId: _.get(row, 'project.id'),
        environmentId: _.get(row, 'environment.id')
      },
      query: {
        id: _.get(row, 'service.id'),
        from: 'dashboard'
      }
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
