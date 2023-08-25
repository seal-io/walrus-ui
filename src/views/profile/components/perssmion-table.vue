<template>
  <div class="permission-table">
    <DefinePermissionState v-slot="{ action, record }">
      <span v-if="record.isParent">{{ _.get(record, _.toLower(action)) }}</span>
      <span v-else-if="!_.includes(record.actionsScope, action)">-</span>
      <span
        v-else-if="
          _.includes(record.actions, Actions[action]) ||
          _.includes(record.actions, '*')
        "
      >
        <icon-check-circle-fill style="color: var(--seal-color-success)" />
      </span>
      <span v-else>
        <icon-close-circle-fill style="color: var(--seal-color-error)" />
      </span>
    </DefinePermissionState>
    <div class="search-box">
      <GroupTitle :title="title" iconed :bordered="false"></GroupTitle>
      <a-space v-if="pagination && permissionList.length > 10" class="page">
        <a-input-search
          v-model="query"
          allow-clear
          style="width: 220px; margin-left: 10px"
        ></a-input-search>
        <a-pagination
          v-model:current="pageInfo.page"
          :total="dataList.length"
          simple
          size="small"
          :page-size="pageInfo.pageSize"
        />
      </a-space>
    </div>
    <a-table
      column-resizable
      style="margin-bottom: 40px"
      :bordered="true"
      :data="resultList"
      :pagination="false"
      :row-class="setRowClass"
      @expanded-change="handleExpanded"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :body-cell-class="setRowClass"
          :cell-style="{ minWidth: '40px' }"
          data-index="projectName"
          :title="
            type === 'project'
              ? $t('propfile.permission.table.project')
              : $t('propfile.permission.table.group')
          "
        >
        </a-table-column>

        <a-table-column
          ellipsis
          tooltip
          :body-cell-class="setRowClass"
          :cell-style="{ minWidth: '40px' }"
          data-index="resource"
          :title="$t('propfile.permission.table.resource')"
        >
          <template #cell="{ record }">
            <span v-if="record.isParent">{{ record.resource }}</span>
            <span v-else>{{ $t(record.resource) || '' }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="type === 'project'"
          ellipsis
          tooltip
          :body-cell-class="setRowClass"
          :cell-style="{ minWidth: '40px' }"
          data-index="role"
          align="center"
          :title="$t('propfile.permission.table.role')"
        >
          <template #cell="{ record }">
            <span>{{
              _.map(record.role, (role) => {
                return $t(getListLabel(role, projectRoles));
              }).join(',')
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          :body-cell-class="setRowClass"
          align="center"
          data-index="actions"
          :title="$t('propfile.permission.table.permission')"
        >
          <a-table-column
            align="center"
            data-index="post"
            :body-cell-class="setRowClass"
            :width="65"
            :title="$t('common.permission.action.post')"
          >
            <template #cell="{ record }">
              <ReusePermissionState
                v-bind="{ record, action: 'POST' }"
              ></ReusePermissionState>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            data-index="get"
            :body-cell-class="setRowClass"
            :width="65"
            :title="$t('common.permission.action.get')"
          >
            <template #cell="{ record }">
              <ReusePermissionState
                v-bind="{ record, action: 'GET' }"
              ></ReusePermissionState>
            </template>
          </a-table-column>

          <a-table-column
            align="center"
            data-index="put"
            :body-cell-class="setRowClass"
            :width="65"
            :title="$t('common.permission.action.put')"
          >
            <template #cell="{ record }">
              <ReusePermissionState
                v-bind="{ record, action: 'PUT' }"
              ></ReusePermissionState>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            data-index="delete"
            :body-cell-class="setRowClass"
            :width="65"
            :title="$t('common.permission.action.delete')"
          >
            <template #cell="{ record }">
              <ReusePermissionState
                v-bind="{ record, action: 'DELETE' }"
              ></ReusePermissionState>
            </template>
          </a-table-column>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, PropType, reactive, computed } from 'vue';
  import { createReusableTemplate } from '@vueuse/core';
  import GroupTitle from '@/components/group-title/index.vue';
  import { projectRoles } from '@/views/application-management/projects/config';
  import { getListLabel } from '@/utils/func';
  import { Actions } from '@/permissions/config';

  const props = defineProps({
    permissionList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    pagination: {
      type: Boolean,
      default() {
        return false;
      }
    },
    type: String,
    title: String
  });

  const [DefinePermissionState, ReusePermissionState] = createReusableTemplate<{
    action: string;
    record: any;
  }>();
  const pageInfo = reactive({
    page: 1,
    pageSize: 10
  });
  const query = ref('');
  const expandedKeys = ref<string[]>([]);

  const dataList = computed(() => {
    if (!query.value) {
      return props.permissionList;
    }
    return _.filter(props.permissionList, (item) =>
      _.includes(item.projectName, query.value)
    );
  });
  const resultList = computed(() => {
    return _.get(_.chunk(dataList.value, pageInfo.pageSize), pageInfo.page - 1);
  });
  const setRowClass = (record) => {
    if (_.includes(expandedKeys.value, record.key) && record.isParent) {
      return 'row-expanded';
    }
    return '';
  };
  const handleExpanded = (keys) => {
    expandedKeys.value = keys;
  };
</script>

<style lang="less" scoped>
  .permission-table {
    .search-box {
      display: flex;
      align-items: baseline;
      justify-content: space-between;

      .page {
        position: relative;
        bottom: 5px;
      }
    }

    :deep(.arco-table-element) {
      .arco-table-tr {
        .arco-table-td.row-expanded {
          background-color: var(--color-fill-2);
        }
      }
    }

    :deep(.group-title) {
      .label .title-wrap {
        justify-content: flex-start;
      }
    }
  }
</style>
