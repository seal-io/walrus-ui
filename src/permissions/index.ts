import _ from 'lodash';
import appRoutes from '@/router/routes';
import { useUserStore } from '@/store';

const checkResourcePermission = (permission) => {
  const userStore = useUserStore();
  const { resource, actions } = permission || {};
  const permissionActions =
    _.get(userStore, `permissions.roles.${resource}`) || [];
  if (_.includes(permissionActions, '*')) {
    return true;
  }
  return _.every(actions, (ac) => _.includes(permissionActions, ac));
};

// control the menu display
export const routesPermissionHandler = () => {
  const userStore = useUserStore();
  const staticRoutes = _.cloneDeep(appRoutes);
  _.each(staticRoutes, (item) => {
    if (_.get(item, 'meta.requiresAuth')) {
      const permission = _.get(item, 'meta.permission') || {};
      if (!checkResourcePermission(permission)) {
        // routes.removeRoute(item.name || '');
        _.set(item, 'meta.isRemove', true);
      }
    } else if (item.children && item.children?.length) {
      _.each(item.children, (cItem) => {
        const permission = _.get(cItem, 'meta.permission') || {};
        if (!checkResourcePermission(permission)) {
          // routes.removeRoute(cItem.name || '');
          _.set(item, 'meta.isRemove', true);
        }
      });
    }
  });

  // filtering appRoutes is to get the default first page
  const result = _.filter(staticRoutes, (item) => {
    if (item.children && item.children.length) {
      item.children = _.filter(item.children, (cItem) => {
        return (
          !_.get(cItem, 'meta.requiresAuth') || !_.get(cItem, 'meta.isRemove')
        );
      });
    }
    if (_.get(item, 'meta.isRouteView')) {
      return item.children?.length;
    }
    return _.get(item, 'meta.requiresAuth');
  });
  userStore.setInfo({ permissionRoutes: result });
  return result;
};

export default {};
