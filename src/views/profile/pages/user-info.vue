<template>
  <div class="wrapper">
    <a-form :model="formData" auto-label-width>
      <a-form-item :label="$t('profile.account.form.uername')">
        <span class="readonly-view-label">{{ userStore.name }}</span>
      </a-form-item>
      <a-form-item :label="$t('profile.account.form.role')" auto-label-width>
        <span class="readonly-view-label">{{ $t(getUserRole) }}</span>
      </a-form-item>
    </a-form>
    <div>
      <PermissionTable
        type="project"
        :permission-list="projectPermissions"
        :title="$t('propfile.permission.type.project')"
      ></PermissionTable>
      <PermissionTable
        :permission-list="systemPermissions"
        :title="$t('propfile.permission.type.system')"
      ></PermissionTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, toRef, computed } from 'vue';
  import { useUserStore } from '@/store';
  import { ROLES } from '@/store/modules/user/types';
  import { RoleType, RolesTypeMap } from '@/views/system/config/users';
  import resources, { Actions } from '@/permissions/resources';
  import { getListLabel } from '@/utils/func';
  import PermissionTable from '../components/perssmion-table.vue';

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
  const calcPermissionCount = (list: any[], action) => {
    return _.reduce(
      list,
      (total, item) => {
        if (_.includes(item.actions, action) || _.includes(item.actions, '*')) {
          total += 1;
        }
        return total;
      },
      0
    );
  };
  const projectPermissions = computed(() => {
    const projectRoles = _.get(userStore, 'permissions.projectRoles') || {};
    const resultList: object[] = [];
    _.each(_.keys(projectRoles), (projectID, i) => {
      const projectChildren: any[] = [];
      // project
      const project = _.get(projectRoles, `${projectID}`);
      // resources
      const policies = _.get(project, 'policies') || [];
      _.each(_.keys(policies), (resource, index) => {
        projectChildren.push({
          resource: getListLabel(resource, resources, {
            value: 'resource',
            label: 'title'
          }),
          actions: _.includes(policies[resource], '*')
            ? ['*']
            : policies[resource]
        });
      });

      resultList.push({
        projectName: _.get(project, `projectName`),
        children: projectChildren,
        resource: _.keys(policies).length,
        resourceCount: _.keys(policies).length,
        isParent: true,
        key: _.get(project, `projectName`),
        role: _.keys(_.get(project, 'roles')),
        post: calcPermissionCount(projectChildren, Actions.POST),
        get: calcPermissionCount(projectChildren, Actions.GET),
        delete: calcPermissionCount(projectChildren, Actions.DELETE),
        put: calcPermissionCount(projectChildren, Actions.PUT)
      });
    });
    console.log('resultList===', resultList);
    return resultList;
  });

  const systemPermissions = computed(() => {
    const systemRoles =
      _.omit(_.get(userStore, 'permissions.roles'), [ROLES, 'tokens']) || [];

    const result = _.reduce(
      _.keys(systemRoles),
      (dataMap, resource) => {
        const resourceConf = _.find(
          resources,
          (item) => item.resource === resource
        );
        if (!resourceConf) return dataMap;
        const group = resourceConf.group as string;
        if (dataMap.has(group)) {
          // const groupData
          const groupData = dataMap.get[group];
          dataMap.get(group)?.children?.push({
            resource: resourceConf?.title,
            actions: _.includes(_.get(systemRoles, resource), '*')
              ? ['*']
              : _.get(systemRoles, resource)
          });
        } else {
          dataMap.set(group, {
            group,
            order: resourceConf?.order,
            key: group,
            projectName: group,
            isParent: true,
            children: [
              {
                resource: resourceConf?.title,
                actions: _.includes(_.get(systemRoles, resource), '*')
                  ? ['*']
                  : _.get(systemRoles, resource)
              }
            ]
          });
        }
        return dataMap;
      },
      new Map()
    );
    let resultList = _.sortBy([...result.values()], (item) => item.order);
    resultList = _.map(resultList, (item) => {
      return {
        ...item,
        resource: item.children.length,
        post: calcPermissionCount(item.children, Actions.POST),
        get: calcPermissionCount(item.children, Actions.GET),
        delete: calcPermissionCount(item.children, Actions.DELETE),
        put: calcPermissionCount(item.children, Actions.PUT)
      };
    });
    return resultList;
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

      .arco-table-th {
        border-right: 1px solid var(--seal-color-table-border);
        border-bottom: 1px solid var(--seal-color-table-border);
      }

      .arco-table-th::after {
        width: 0;
      }

      .arco-table-td:last-child {
        border-right: 0;
      }

      .arco-table-th:last-child {
        border-right: 0;
      }
    }
  }
</style>
