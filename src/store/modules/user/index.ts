import { defineStore } from 'pinia';
import get from 'lodash/get';
import { AnyObject } from '@/types/global';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getUserSetting as userSettings,
  updateUserSetting as updateSettings
} from '@/api/user';
import { setToken, clearToken, getUserPermission } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';

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
    permissionsList: [],
    role: '*'
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
      const res = await getUserInfo();
      console.log('userInfo:', res);
      const permissions: AnyObject = getUserPermission(
        get(res, 'data.permissionsList') || []
      );
      const user = get(res, 'data.0');
      console.log('permissions:', permissions);
      this.setInfo({ ...user, permissions });
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        this.info();
        // setToken();
      } catch (err) {
        // clearToken();
        console.log(err);
      }
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
