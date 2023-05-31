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
import { clearToken, getUserResourcePermission } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { Actions } from '@/permissions/resources';
import { RoleType } from '@/views/system/config/users';
import { UserState } from './types';
import testData from './test';

const useUserStore = defineStore('user', {
  persist: {
    key: 'user'
  },
  state: (): UserState => ({
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
    // Set user's information
    // setInfo(partial: Partial<UserState>) {
    //   this.$patch(partial);
    // },
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
    hasProjectResourceActions({ projectID, resource, actions }) {
      const path = this.getProjectUserActions(projectID, resource);
      return (
        this.isSystemAdmin() ||
        this.hasActionsPermission({ resource: path, actions })
      );
    },
    // Login
    async login(loginForm: LoginData) {
      await userLogin(loginForm);
      // await this.info();
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
      clearToken();
      removeRouteListener();
    },
    permissionCheckFailed() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    }

    // init permission
  }
});

export default useUserStore;
