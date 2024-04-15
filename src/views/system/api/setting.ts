import axios from 'axios';
import qs from 'query-string';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import { AxiosRequestPayload, DataListItem } from '@/types/global';

type ValueType = string | number | boolean;

export { GlobalNamespace, NAMESPACES };

export const SETTINGS_API = 'settings';

const generateSettingAPI = (params: { namespace: string; name?: string }) => {
  const { name, namespace } = params;
  if (name) {
    return `/${NAMESPACES}/${namespace}/${SETTINGS_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${SETTINGS_API}`;
};

export interface SettingsItem {
  id: string;
  value: ValueType;
  name: string;
  hidden: boolean;
  editable: boolean;
  private?: boolean;
}

interface ResList {
  items: Array<DataListItem>;
}
export interface BatchItem {
  name: string;
  namespace: string;
  data: AxiosRequestPayload;
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

export function queryUserPartialSetting(params) {
  const url = generateSettingAPI({
    namespace: GlobalNamespace
  });
  return axios.get<ResList>(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
