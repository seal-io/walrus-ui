import axios from 'axios';

type ValueType = string | number | boolean;
export interface SettingsItem {
  id: string;
  value: ValueType;
  hidden: boolean;
  editable: boolean;
  private?: boolean;
}
interface ResList {
  items: Array<SettingsItem>;
}
export interface BatchItem {
  id: string;
  value: ValueType;
}
export function updateUserSetting(data: { id: string; value: string }) {
  return axios.put(`/settings/${data.id}`, data);
}
export function updateUserSettingBatch(data: BatchItem[]) {
  return axios.put(`/settings`, data);
}
export function getUserSetting() {
  return axios.get<ResList>(`/settings`);
}
