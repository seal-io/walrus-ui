import axios from 'axios';
import { SILENCEAPI } from '@/api/config';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import {
  RequestCallbackArgs,
  AxiosRequestPayload,
  DataListItem
} from '@/types/global';

interface ResList {
  items: DataListItem[];
}
export interface LoginData {
  username: string;
  password: string;
}

interface SetPassword {
  oldPassword: string;
  password: string;
  name?: string;
}

export { GlobalNamespace, NAMESPACES };

const SETTINGS_API = 'settings';

const generateSettingAPI = (params: { namespace: string; name?: string }) => {
  const { name, namespace } = params;
  if (name) {
    return `/${NAMESPACES}/${namespace}/${SETTINGS_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${SETTINGS_API}`;
};
export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/identify/login', data);
}

export function logout() {
  return axios.delete<LoginRes>('/identify/logout');
}

export function modifyPassword(data: SetPassword) {
  return axios.put(`/identify/profile`, data);
}

export function getUserInfo(params?) {
  return axios.get('/identify/profile', {
    params,
    headers: {
      _action: SILENCEAPI
    }
  });
}

export function updateUserSetting(params: {
  name: string;
  namespace: string;
  data: AxiosRequestPayload;
}) {
  const url = generateSettingAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.put(url, params.data);
}

export function getUserSetting() {
  const url = generateSettingAPI({
    namespace: GlobalNamespace
  });
  return axios.get<ResList>(url);
}
export function getFirstLoginStatus() {
  const url = generateSettingAPI({
    namespace: GlobalNamespace,
    name: 'BootPwdGainSource'
  });
  return axios.get<{ id: string; value: string }>(url);
}

export function getWalrusFileHub() {
  return axios.get<{ id: string; value: string }[]>(`/walrus-file-hub`);
}
