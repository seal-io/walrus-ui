<template>
  <div class="wrapper">
    <a-form :model="formData" auto-label-width>
      <a-form-item label="用户名">
        <span class="readonly-view-label">{{ userStore.name }}</span>
      </a-form-item>
      <a-form-item label="系统角色" auto-label-width>
        <span class="readonly-view-label">{{ $t(getUserRole) }}</span>
      </a-form-item>
    </a-form>
    <div>
      <GroupTitle title="项目权限" iconed :bordered="false"></GroupTitle>
      <a-table
        column-resizable
        style="margin-bottom: 40px"
        :bordered="true"
        :data="projectPermissions"
        :pagination="false"
        span-all
        :span-method="projectPermissionSpan"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="projectName"
            title="项目"
          >
          </a-table-column>

          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="resource"
            title="资源"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="role"
            align="center"
            title="角色"
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
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="actions"
            title="权限范围"
          >
            <template #cell="{ record }">
              <span>{{
                _.map(record.actions, (item) => {
                  return permissionScope[item] || '';
                })
              }}</span>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <GroupTitle title="系统权限" iconed :bordered="false"></GroupTitle>
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :bordered="true"
        :data="systemPermissions"
        :pagination="false"
        span-all
        :span-method="systemPermissionSpan"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="group"
            title="分组"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="resource"
            title="资源"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="actions"
            align="center"
            title="权限范围"
          >
            <template #cell="{ record }">
              <span>{{
                _.map(record.actions, (item) => {
                  return permissionScope[item] || '';
                })
              }}</span>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, toRef, computed } from 'vue';
  import { useUserStore } from '@/store';
  import { ROLES } from '@/store/modules/user/types';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    roleTypeList,
    RoleType,
    RolesTypeMap
  } from '@/views/system/config/users';
  import resources, {
    permissionScope,
    Resources
  } from '@/permissions/resources';
  import { projectRoles } from '@/views/application-management/projects/config';
  import { getListLabel } from '@/utils/func';

  const userStore = useUserStore();
  const formData = {};

  const getUserRole = computed(() => {
    const { roles } = userStore;
    const admin = _.find(roles, (item) => item.id === RoleType.Admin);
    if (admin) {
      return _.get(RolesTypeMap, admin.id);
    }
    const engnieer = _.find(roles, (item) => item.id === RoleType.Engineer);
    if (engnieer) {
      return _.get(RolesTypeMap, engnieer.id);
    }
    return _.get(RolesTypeMap, RoleType.User);
  });

  const projectPermissions = computed(() => {
    const projectRoles = _.get(userStore, 'permissions.projectRoles') || {};
    const resultList: object[] = [];
    _.each(_.keys(projectRoles), (projectID, i) => {
      // project
      const project = _.get(projectRoles, `${projectID}`);
      // resources
      const policies = _.get(project, 'policies') || [];
      _.each(_.keys(policies), (resource, index) => {
        resultList.push({
          resource: getListLabel(resource, resources, {
            value: 'resource',
            label: 'title'
          }),
          resourceCount: _.keys(policies).length,
          projectName: _.get(project, `projectName`),
          role: _.keys(_.get(project, 'roles')),
          actions: _.includes(policies[resource], '*')
            ? ['*']
            : policies[resource]
        });
      });
    });
    console.log('resultList===', resultList);
    return resultList;
  });

  const systemPermissions = computed(() => {
    const systemRoles =
      _.omit(_.get(userStore, 'permissions.roles'), [ROLES, 'tokens']) || [];
    let result = _.map(_.keys(systemRoles), (resource) => {
      const resourceConf = _.find(
        resources,
        (item) => item.resource === resource
      );
      return {
        resource: resourceConf?.title,
        group: resourceConf?.group,
        order: resourceConf?.order,
        actions: _.includes(_.get(systemRoles, resource), '*')
          ? ['*']
          : _.get(systemRoles, resource)
      };
    });
    result = _.sortBy(result, (item) => item.order);
    return result;
  });

  const projectPermissionSpan = ({ record, rowIndex, columnIndex }) => {
    if (columnIndex === 0 || columnIndex === 2) {
      if (rowIndex === 0) {
        return {
          rowspan: record.resourceCount,
          colspan: 0
        };
      }
      if (
        _.get(projectPermissions.value, `${rowIndex - 1}.projectName`) !==
        record.projectName
      ) {
        return {
          rowspan: record.resourceCount,
          colspan: 0
        };
      }
    }
    return {
      rowspan: 0,
      colspan: 0
    };
  };
  const systemPermissionSpan = ({ record, rowIndex, columnIndex }) => {
    if (columnIndex === 0 && rowIndex === 0) {
      return {
        rowspan: _.filter(
          systemPermissions.value,
          (item) => item.group === record.group
        ).length,
        colspan: 0
      };
    }
    if (
      columnIndex === 0 &&
      _.get(systemPermissions.value, `${rowIndex - 1}.group`) !== record.group
    ) {
      return {
        rowspan: _.filter(
          systemPermissions.value,
          (item) => item.group === record.group
        ).length,
        colspan: 0
      };
    }
    return {
      rowspan: 0,
      colspan: 0
    };
  };
</script>

<style lang="less" scoped>
  .wrapper {
    text-align: left;

    :deep(.arco-table) {
      .arco-table-td {
        border-right: 1px solid var(--seal-color-table-border);
      }

      .arco-table-td:last-child {
        border-right: 0;
      }
    }
  }
</style>
