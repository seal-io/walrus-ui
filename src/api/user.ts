import axios from 'axios';
import { SILENCEAPI } from '@/api/config';

interface ResList {
  items: { id: string; value: string; name: string }[];
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
export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/account/login', data);
}

export function logout() {
  return axios.delete<LoginRes>('/account/logout');
}

export function modifyPassword(data: SetPassword) {
  return axios.put(`/account/info`, data);
}

export function getUserInfo(params?) {
  return axios.get('/account/info', {
    params,
    headers: {
      _action: SILENCEAPI
    }
  });
}

export function updateUserSetting(data: { id: string; value: string }) {
  return axios.put(`/settings/${data.id}`, data);
}

export function getUserSetting() {
  return axios.get<ResList>(`/settings`);
}
export function getFirstLoginStatus() {
  return axios.get<{ id: string; value: string }>(
    `/settings/BootPwdGainSource`
  );
}

export function getWalrusFileHub() {
  return axios.get<{ id: string; value: string }[]>(`/walrus-file-hub`);
}
