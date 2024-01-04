import {
  ProjectRolesItem,
  RolesItem,
  ROLES,
  permissionKey
} from '@/store/modules/user/types';
import JSCookies from 'js-cookie';
import localForage from '@/utils/localStore';
import _ from 'lodash';
import { Resources } from '@/permissions/config';

interface LoginInfo {
  username: string;
  password: string;
  rememberPswd: boolean;
}
export const LOGIN_INFO = 'LOGIN_INFO';

export const TEMP_LOGIN_INFO = 'TEMP_LOGIN_INFO';

const TOKEN_KEY = 'authed';
const LOGIN_HISTORY = 'LOGIN_HISTORY';

const localStore = localForage.createInstance({ name: 'walrus' });

const rememberPasswordFn = (key, data: LoginInfo) => {
  if (localStore) {
    localStore.setItem(key, data);
  }
};

const readLocalLoginInfo = (key): Promise<LoginInfo> | null => {
  if (localStore) {
    return localStore.getItem(key) as Promise<LoginInfo>;
  }
  return null;
};
const setUserLoginHistory = () => {
  if (localStore) {
    localStore.setItem(LOGIN_HISTORY, true);
  }
};
const removeUserLoginHistory = () => {
  if (localStore) {
    localStore.removeItem(LOGIN_HISTORY);
  }
};
const getUserLoginHistory = async () => {
  const res = await localStore.getItem(LOGIN_HISTORY);
  return !!res || false;
};
const removeLocalLoginInfo = () => {
  localStore.removeItem(LOGIN_INFO);
};

const removeTempLocalLoginInfo = () => {
  localStore.removeItem(TEMP_LOGIN_INFO);
};

const getToken = () => {
  return JSCookies.get(TOKEN_KEY);
};

const setToken = () => {
  JSCookies.set(TOKEN_KEY, true);
};

const clearToken = () => {
  JSCookies.remove(TOKEN_KEY);
};

const getResourcePolicies = (role: RolesItem) => {
  const policies = _.get(role, 'policies') || [];
  const rolePolicies = _.reduce(
    policies,
    (rolePolicyMap, item) => {
      const resources =
        _.get(item, 'resources.0') === '*'
          ? Object.values(Resources)
          : _.get(item, 'resources') || [];

      const paths = _.get(item, 'paths') || [];
      const pathsPolicy = _.reduce(
        paths,
        (pathPolicyMap, path) => {
          pathPolicyMap[path] = [...(item.actions || [])];
          return pathPolicyMap;
        },
        {}
      );

      const resourcePolicy = _.reduce(
        resources,
        (resourceActionsMap, resourceName) => {
          resourceActionsMap[resourceName] = [...(item.actions || [])];
          return resourceActionsMap;
        },
        {}
      );
      rolePolicyMap = {
        ...rolePolicyMap,
        ...resourcePolicy,
        ...pathsPolicy
      };
      return rolePolicyMap;
    },
    {}
  );
  return rolePolicies;
};

const getRolesPolicies = (rolesList: RolesItem[]) => {
  if (!rolesList.length) return {};
  const result = _.reduce(
    rolesList,
    (rolesPolicyMap, item) => {
      // single role policy
      const resourcePolicy = getResourcePolicies(item);
      _.set(rolesPolicyMap, `${ROLES}.${item.id}`, _.cloneDeep(resourcePolicy));
      rolesPolicyMap = _.assignInWith(
        rolesPolicyMap,
        resourcePolicy,
        (obj, src) => {
          if (obj) {
            return _.concat(obj, src);
          }
          return src;
        }
      );
      return rolesPolicyMap;
    },
    {}
  );
  return result;
};

const getProjectRolesPolicies = (projectRoles: ProjectRolesItem[]) => {
  if (!projectRoles.length) return {};
  const result = _.reduce(
    projectRoles,
    (obj, project) => {
      const projectID = _.get(project, 'project.id') || '';
      obj[projectID] = {
        projectID,
        projectName: _.get(project, 'project.name'),
        readOnlyEnvironments:
          _.get(project, 'project.readOnlyEnvironments') || [],
        readOnlyConnectors: _.get(project, 'project.readOnlyConnectors') || [],
        policies: {
          ..._.omit(getRolesPolicies(project.roles), ROLES)
        },
        roles: {
          ...(_.get(getRolesPolicies(project.roles), ROLES) || {})
        }
      };
      return obj;
    },
    {}
  );
  return result;
};
const getUserResourcePermission = (data) => {
  // role policies
  const roles = getRolesPolicies(_.get(data, permissionKey.roles) || []);

  // project policies
  const projectRoles = getProjectRolesPolicies(
    _.get(data, permissionKey.projectRoles) || []
  );

  return {
    roles,
    projectRoles
  };
};

export {
  getToken,
  setToken,
  clearToken,
  getUserResourcePermission,
  rememberPasswordFn,
  readLocalLoginInfo,
  removeLocalLoginInfo,
  removeTempLocalLoginInfo,
  setUserLoginHistory,
  getUserLoginHistory,
  removeUserLoginHistory
};

export default localStore;
