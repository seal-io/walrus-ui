<template>
  <div class="wrapper">
    <a-form
      :model="formData"
      auto-label-width
      layout="inline"
      style="margin-bottom: 20px"
    >
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
  import _, { reduce } from 'lodash';
  import { ref, toRef, computed } from 'vue';
  import { useUserStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import { ROLES } from '@/store/modules/user/types';
  import { RoleType, RolesTypeMap } from '@/views/system/config/users';
  import { Actions, GroupMap, ResourcesActionsDic } from '@/permissions/config';
  import resources, {
    ProjectPermissionResource
  } from '@/permissions/resources';
  import { getListLabel } from '@/utils/func';
  import PermissionTable from '../components/perssmion-table.vue';

  const { t } = useCallCommon();
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
  // some api send a POST request for get data.
  const getResourceActions = (actions: string[], resource) => {
    let result = actions;
    if (_.includes(result, '*')) {
      result = ['*'];
    } else if (_.get(ResourcesActionsDic, resource)) {
      result = _.map(result, (ac) =>
        _.get(ResourcesActionsDic, `${resource}.${ac}`)
      );
    }
    return result;
  };
  const projectPermissions = computed(() => {
    const projectRoles = _.get(userStore, 'permissions.projectRoles') || {};
    const resultList: object[] = [];
    _.each(_.keys(projectRoles), (projectID, i) => {
      const projectChildren: any[] = [];
      // project
      const project = _.get(projectRoles, `${projectID}`);
      // resources
      let policies: Record<string, string[]> = {};
      // admin has all of project resource actions
      if (userStore.isSystemAdmin()) {
        policies = _.reduce(
          ProjectPermissionResource,
          (obj, item) => {
            obj[item.resource] = item.actions;
            return obj;
          },
          {}
        );
      } else {
        policies =
          _.pickBy(_.get(project, 'policies'), (v, k) => {
            return _.some(
              ProjectPermissionResource,
              (item) => item.resource === k
            );
          }) || {};
      }

      _.each(_.keys(policies), (resource, index) => {
        const resourceConf = _.find(
          ProjectPermissionResource,
          (item) => item.resource === resource
        );
        projectChildren.push({
          resource: resourceConf?.title,
          actionsScope: resourceConf?.actions,
          actions: getResourceActions(policies[resource] || [], resource)
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
    return resultList;
  });

  const systemPermissions = computed(() => {
    const systemRoles =
      _.pickBy(_.get(userStore, 'permissions.roles'), (v, k) => {
        return _.some(resources, (item) => item.resource === k);
      }) || {};

    const result = _.reduce(
      _.keys(systemRoles),
      (dataMap, resource) => {
        const resourceConf = _.find(
          resources,
          (item) => item.resource === resource
        );

        if (!resourceConf) return dataMap;

        const group = resourceConf.group as string;
        // some page post request is a search action.
        const actions = getResourceActions(
          _.get(systemRoles, resource),
          resource
        );
        const actionsScope = getResourceActions(resourceConf.actions, resource);
        if (dataMap.has(group)) {
          // const groupData
          dataMap.get(group)?.children?.push({
            resource: resourceConf?.title,
            actionsScope,
            actions
          });
        } else {
          dataMap.set(group, {
            group,
            order: resourceConf?.order,
            key: group,
            projectName: t(_.get(GroupMap, group)),
            isParent: true,
            children: [
              {
                resource: resourceConf?.title,
                actionsScope,
                actions
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
