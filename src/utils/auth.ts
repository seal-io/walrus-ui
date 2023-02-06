import { AnyObject } from '@/types/global';
import { UserRouterPermission } from '@/store/modules/user/types';
// import localForage from 'localforage';
import JSCookies from 'js-cookie';
import localForage from '@/utils/localStore';

interface LoginInfo {
  username: string;
  password: string;
  rememberPswd: boolean;
}
const TOKEN_KEY = 'authed';
const LOGIN_INFO = 'LOGIN_INFO';
const LOGIN_HISTORY = 'LOGIN_HISTORY';

const localStore = localForage.createInstance({ name: 'SEAL' });

const isLogin = () => {
  return !!JSCookies.get(TOKEN_KEY);
};

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

const getUserPermission = (list: UserRouterPermission[]) => {
  const permissionMap = list.reduce(
    (obj: AnyObject, item: UserRouterPermission) => {
      obj[item.path] = item.permission || [];
      return obj;
    },
    {}
  );
  return permissionMap;
};

export {
  isLogin,
  getToken,
  setToken,
  clearToken,
  getUserPermission,
  rememberPasswordFn,
  readLocalLoginInfo,
  removeLocalLoginInfo,
  setUserLoginHistory,
  getUserLoginHistory,
  removeUserLoginHistory,
};

export default localStore;
