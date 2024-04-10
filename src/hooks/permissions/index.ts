import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import _, { get } from 'lodash';

const checkPermission = (permission, userStore, to?) => {
  // just for refactor test
  // TODO
  if (userStore.name) {
    return true;
  }
  const currentVisitProject = to?.params?.projectId || userStore.currentProject;
  const routePageAction = to?.params?.action;
  // type always set in the detail page that projects relate to
  const { resource, actions, type, pageAction } = permission || {};

  // system access permission
  let resourcePath: string = userStore.permissionsKey.roles; // roles

  // 1. admin
  if (
    type === userStore.permissionsKey.projectRoles &&
    userStore.isSystemAdmin()
  )
    return true;

  // 2. project access permission or system access permission
  if (type === userStore.permissionsKey.projectRoles) {
    resourcePath = `${userStore.permissionsKey.projectRoles}.${currentVisitProject}.policies`;
  }
  const permissionActions =
    _.get(userStore, `permissions.${resourcePath}.${resource}`) || [];
  if (_.includes(permissionActions, '*')) {
    return true;
  }
  // 3. aim to the detail page that there are view and edit operation, e.g.: connector detail page
  if (routePageAction && pageAction) {
    const ac = _.get(pageAction, routePageAction);
    return _.every(ac, (ac) => _.includes(permissionActions, ac));
  }
  // 4.
  return _.every(actions, (ac) => _.includes(permissionActions, ac));
};

export const checkResourcePermission = (permission, to?) => {
  const userStore = useUserStore();
  if (_.isArray(permission)) {
    return _.some(permission, (_permission) => {
      return checkPermission(_permission, userStore, to);
    });
  }
  return checkPermission(permission, userStore, to);
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

    getFirstRouteName(appRoutes: routeRaw[]) {
      const firstChildren = get(appRoutes, '0.children') || [];
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
