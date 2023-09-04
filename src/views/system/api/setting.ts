import axios from 'axios';
import qs from 'query-string';

type ValueType = string | number | boolean;

export const SETTINGS_API = '/settings';
export interface SettingsItem {
  id: string;
  value: ValueType;
  name: string;
  hidden: boolean;
  editable: boolean;
  private?: boolean;
}
interface ResList {
  items: Array<SettingsItem>;
}
export interface BatchItem {
  id?: string;
  name?: string;
  value: ValueType;
}
export function updateUserSetting(data: { id: string; value: string }) {
  return axios.put(`/settings/${data.id}`, data);
}
export function updateUserSettingBatch(data: { items: BatchItem[] }) {
  return axios.put(`/settings`, data);
}

export function getUserSetting() {
  return axios.get<ResList>(`/settings`);
}

export function queryUserPartialSetting(params) {
  return axios.get<ResList>(`/settings`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
