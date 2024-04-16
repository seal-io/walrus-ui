import { defineStore } from 'pinia';
import { AnyObject } from '@/types/global';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getUserSetting as userSettings,
  updateUserSetting as updateSettings
} from '@/views/login/api';
import _ from 'lodash';
import { FirstGetPasswordCommand } from '@/views/login/config';
import { getUserResourcePermission } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { Actions, UpdateActions } from '@/permissions/config';
import { RoleType } from '@/views/system/config/users';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  persist: {
    key: 'user'
  },
  state: (): UserState => ({
    applicableEnvironmentTypes: [],
    name: undefined,
    displayName: undefined,
    avatar: undefined,
    job: undefined,
    id: '',
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    permissions: {},
    userSetting: {},
    hasNavList: true,
    policies: [],
    projectRoles: [],
    permissionRoutes: [],
    currentProject: '',
    roles: [],
    role: '*',
    permissionsKey: {
      projectRoles: 'projectRoles',
      roles: 'roles'
    }
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'Admin' : 'user';
        resolve(this.role);
      });
    },

    setInfo(partial: any) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      try {
        const { data } = await getUserInfo();
        const permissions: AnyObject = getUserResourcePermission(data);
        this.permissions = {};
        this.setInfo({ ...data, permissions });
      } catch (error) {
        // error
      }
    },
    getProjectUserActions(id, resource) {
      const path = `${this.permissionsKey.projectRoles}.${id}.policies.${resource}`;
      return path;
    },
    isSystemAdmin() {
      return this.role === RoleType.Admin;
    },
    checkUserRole(roles, role) {
      return _.some(roles, (item) => item.id === role);
    },
    hasActionsPermission(config: { resource: string; actions: string[] }) {
      const { resource, actions } = config;
      const permissionActions = (_.get(this.permissions, resource) ||
        []) as Array<string>;
      const hasPermission =
        _.includes(permissionActions, Actions.All) ||
        _.every(actions, (ac) => _.includes(permissionActions, ac));
      return hasPermission;
    },
    hasRolesActionsPermission(config: { resource: string; actions: string[] }) {
      if (this.isSystemAdmin()) {
        return true;
      }
      const { resource, actions } = config;
      const permissionActions = (_.get(
        this.permissions,
        `${this.permissionsKey.roles}.${resource}`
      ) || []) as Array<string>;
      const hasPermission =
        _.includes(permissionActions, Actions.All) ||
        _.every(actions, (ac) => _.includes(permissionActions, ac));
      return hasPermission;
    },

    hasUpdateAction(actions) {
      return _.some(actions, (ac) => _.includes(UpdateActions, ac));
    },
    isReadOnlyEnvironment(projectID, environmentID) {
      if (!projectID || !environmentID) return false;
      const readOnlyEnvironments = _.get(
        this.permissions,
        `${this.permissionsKey.projectRoles}.${projectID}.readOnlyEnvironments`
      ) as { id: string; name: string }[];
      return _.find(readOnlyEnvironments, {
        id: environmentID
      });
    },
    isReadOnlyConnector(projectID, connectorID) {
      if (!projectID || !connectorID) return false;
      const readOnlyConnectors = _.get(
        this.permissions,
        `${this.permissionsKey.projectRoles}.${projectID}.readOnlyConnectors`
      ) as { id: string; name: string }[];
      return _.find(readOnlyConnectors, {
        id: connectorID
      });
    },

    hasProjectResourceActions({
      projectID,
      environmentID = '',
      connectorID = '',
      resource,
      actions
    }) {
      if (this.isSystemAdmin()) {
        return true;
      }

      // read only environment
      if (
        environmentID &&
        this.isReadOnlyEnvironment(projectID, environmentID)
      ) {
        return !this.hasUpdateAction(actions);
      }
      // read only connector
      if (connectorID && this.isReadOnlyConnector(projectID, connectorID)) {
        return !this.hasUpdateAction(actions);
      }

      const path = this.getProjectUserActions(projectID, resource);
      return this.hasActionsPermission({ resource: path, actions });
    },
    // Login
    async login(loginForm: LoginData) {
      const { data } = await userLogin(loginForm);
      const permissions: AnyObject = getUserResourcePermission(data);
      this.permissions = {};
      this.setInfo({ ...data, permissions });
    },

    async getUserSetting() {
      const { data } = await userSettings();
      const items = data.items || [];
      const settingData = items.reduce((obj, item) => {
        const name = item.metadata?.name;
        obj[name] = {
          data: item,
          ...item.status
        };
        return obj;
      }, {});
      this.$patch({ userSetting: settingData });
      return data;
    },

    async updateUserSetting(data) {
      return updateSettings(data);
    },

    // Logout
    async logout() {
      await userLogout();

      this.resetInfo();
      removeRouteListener();
    },
    permissionCheckFailed() {
      this.resetInfo();
      removeRouteListener();
    },
    // check first login and is admin user must change password, general user no need to  change password when first login
    isFirstLogin() {
      return (
        _.get(this.userSetting, ['bootstrap-password-provision', 'value']) !==
          FirstGetPasswordCommand.Invalid && this.isSystemAdmin()
      );
    },

    // cancel login verification manually
    cancelVerificationManually() {
      this.$patch({
        name: 'freeUser',
        role: RoleType.Admin,
        roles: [{ id: RoleType.Admin }],
        userSetting: {
          'bootstrap-password-provision': {
            value: FirstGetPasswordCommand.Invalid
          }
        }
      });
    }
  }
});

export default useUserStore;
