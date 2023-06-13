import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import _, { get } from 'lodash';

export const checkResourcePermission = (permission, to?) => {
  const userStore = useUserStore();

  const currentVisitProject = to?.params?.projectId || userStore.currentProject;

  // type always set in the detail page that projects relate to
  const { resource, actions, type } = permission || {};
  let resourcePath = 'roles';
  if (
    type === userStore.permissionsKey.projectRoles &&
    userStore.isSystemAdmin()
  )
    return true;
  if (type === userStore.permissionsKey.projectRoles) {
    resourcePath = `${userStore.permissionsKey.projectRoles}.${currentVisitProject}.policies`;
  }
  const permissionActions =
    _.get(userStore, `permissions.${resourcePath}.${resource}`) || [];
  if (_.includes(permissionActions, '*')) {
    return true;
  }
  return _.every(actions, (ac) => _.includes(permissionActions, ac));
};

export default function usePermission(to?) {
  // const userStore = useUserStore();
  type routeRaw = RouteLocationNormalized | RouteRecordRaw;
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        checkResourcePermission(route.meta?.permission || {}, to)
      );
    },
    // setPermissionRoutes(routes:RouteLocationNormalized) {
    //   const permissions = userStore.permissions
    // },

    getFirstRouteName(appRoutes: routeRaw[]) {
      const firstChildren = get(appRoutes, '0.children');
      const firstName = get(appRoutes, '0.name');
      // all routes permission denied
      if ((!firstChildren || !firstChildren.length) && !firstName)
        return 'forbidden';
      if (firstChildren && firstChildren.length) {
        return get(firstChildren, '0.name');
      }
      return firstName;
    }
    // You can add any rules you want
  };
}
