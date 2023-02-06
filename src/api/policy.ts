import { Pagination } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';
import { FormDataType } from '@/views/policy/config/interface';

export interface conditionType {
  conditionType: string;
  conditionIndex: number;
  value: string;
  operator: string;
}
export interface PolicyTableRow {
  id: string | number;
  number: number | string;
  code: string;
  severity: number | string;
  enabled: boolean;
  name: string;
  status: number;
  disabled?: boolean;
  builtIn?: boolean;
  constraint?: {
    conditions?: conditionType[];
    operator?: string;
  };
  description: string;
  type: string;
  action: string;
}
export interface PolicyTableRes {
  filters: unknown;
  items: PolicyTableRow[];
  pagination: Pagination;
}
export interface PluginPolicyRow {
  id: string;
  pluginName: string;
  type: string;
  category: string;
  configurationFormat: string;
  locales: {
    en: object;
    zh: object;
  };
  conditions: Array<{
    conditionType?: string;
    label: string;
    subLabel?: string;
    min?: number;
    max?: number;
    description?: string;
    valueType: string;
    hasOperator?: boolean;
    operatorConfigs?: Array<{ value: string; label: string }>;
    valueConfigs?: Array<{ value: string; label: string }>;
    name: string;
    operators: string[];
    options: string[];
  }>;
}
export interface PluginPolicyRes {
  filters: unknown;
  pagination: Pagination;
  items: PluginPolicyRow[];
}
export interface PolicyDetailRes {
  data: PolicyTableRow;
}
export interface PolicyTableParams {
  page: number;
  perPage: number;
  severity?: string;
  description?: string;
}
export function queryPolicyDataList(params: PolicyTableParams) {
  return axios.get<PolicyTableRes>('/policies', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function queryPolicyDetail(params: { id: string | number }) {
  return axios.get<PolicyDetailRes>(`/policies/${params.id}`);
}
export function createPolicy(data: FormDataType) {
  return axios.post('/policies', data);
}
export function checkExpression(data: FormDataType) {
  return axios.post('/policies/_/test', data);
}
export function updatePolicy(data: FormDataType) {
  return axios.put(`/policies/${data.id}`, data);
}
export function deletePolicy(data) {
  return axios.delete(`/policies`, { data });
}
export function getPolicyConfigSchmas() {
  return axios.get<PolicyDetailRes>(`/openapi`);
}

export function queryPluginPolicySchemas(params) {
  return axios.get<PluginPolicyRow[]>('/policies/_/schemas', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
