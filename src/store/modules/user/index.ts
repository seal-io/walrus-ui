import { defineStore } from 'pinia';
import { AnyObject } from '@/types/global';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getUserSetting as userSettings,
  updateUserSetting as updateSettings
} from '@/api/user';
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
    avatar: undefined,
    job: undefined,
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
        this.role = this.role === 'user' ? 'admin' : 'user';
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
      const { data } = await getUserInfo();
      const permissions: AnyObject = getUserResourcePermission(data);
      this.permissions = {};
      this.setInfo({ ...data, permissions });
    },
    getProjectUserActions(id, resource) {
      const path = `${this.permissionsKey.projectRoles}.${id}.policies.${resource}`;
      return path;
    },
    isSystemAdmin() {
      return _.some(this.roles, (item) => item.id === RoleType.Admin);
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
      ) as { environment: string; name: string }[];
      return _.find(readOnlyEnvironments, {
        environment: environmentID
      });
    },

    hasProjectResourceActions({
      projectID,
      environmentID = '',
      resource,
      actions
    }) {
      if (this.isSystemAdmin()) {
        return true;
      }

      if (
        environmentID &&
        this.isReadOnlyEnvironment(projectID, environmentID)
      ) {
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
        obj[item.name] = {
          ...item
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
        this.userSetting?.FirstLogin?.value !==
          FirstGetPasswordCommand.Invalid && this.isSystemAdmin()
      );
    }
  }
});

export default useUserStore;
