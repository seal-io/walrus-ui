import {
  ProjectRolesItem,
  RolesItem,
  ROLES,
  permissionKey
} from '@/store/modules/user/types';
// import localForage from 'localforage';
import JSCookies from 'js-cookie';
import localForage from '@/utils/localStore';
import _ from 'lodash';

interface LoginInfo {
  username: string;
  password: string;
  rememberPswd: boolean;
}
const TOKEN_KEY = 'authed';
const LOGIN_INFO = 'LOGIN_INFO';
const LOGIN_HISTORY = 'LOGIN_HISTORY';

const localStore = localForage.createInstance({ name: 'SEAL' });

// const createLocalStore = () => {
//   if (localStore) return
//   localStore = localForage.createInstance({ name: 'SEAL' })
// }
const rememberPasswordFn = (data: LoginInfo) => {
  if (localStore) {
    localStore.setItem(LOGIN_INFO, data);
  }
};

const readLocalLoginInfo = (): Promise<LoginInfo> | null => {
  if (localStore) {
    return localStore.getItem(LOGIN_INFO) as Promise<LoginInfo>;
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
      const resourcePolicy = _.reduce(
        _.get(item, 'resources') || [],
        (resourceActionsMap, resourceName) => {
          resourceActionsMap[resourceName] = [...(item.actions || [])];
          return resourceActionsMap;
        },
        {}
      );
      rolePolicyMap = {
        ...rolePolicyMap,
        ...resourcePolicy
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
      const projectName = _.get(project, 'project.name');
      obj[projectID] = {
        projectID,
        projectName,
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
  setUserLoginHistory,
  getUserLoginHistory,
  removeUserLoginHistory
};

export default localStore;
