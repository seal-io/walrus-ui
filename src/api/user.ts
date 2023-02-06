import axios from 'axios';
import { UserState } from '@/store/modules/user/types';

interface ResList {
  items: { id: string; value: string }[];
}
export interface LoginData {
  username: string;
  password: string;
}

interface SetPassword {
  oldPassword: string;
  newPassword: string;
  name?: string;
}
export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/auth/logout');
}

export function modifyPassword(data: SetPassword) {
  return axios.put(`/users/${data.name}/password`, data);
}

export function getUserInfo(params) {
  return axios.get('/users', { params });
}

export function updateUserSetting(data: { id: string; value: string }) {
  return axios.put(`/settings/${data.id}`, data);
}

export function getUserSetting() {
  return axios.get<ResList>(`/settings`);
}
export function getFirstLoginStatus() {
  return axios.get<{ id: string; value: string }>(`/settings/FirstLogin`);
}
export function checkEnableAuth() {
  return axios.get('/settings/EnableAuth');
}
