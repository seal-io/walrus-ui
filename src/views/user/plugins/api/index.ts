import { Pagination } from '@/types/global';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';

export interface TableListRow {
  id: string;
  createTime: string;
  updateTime: string;
  status: string;
  statusMessage: string;
  name: string;
  description: string;
  enabled: boolean;
  builtIn: boolean;
  disabled?: boolean;
  category: string;
  url: string;
  checksum: string;
}

export interface ListParams {
  page: number;
  perPage: number;
}

export interface PluginsListRes {
  items: TableListRow[];
  pagination: Pagination;
}

export interface PostFormData {
  name: string;
  url: string;
  checksum: string;
  builtIn?: boolean;
  description: string;
  enabled: boolean;
  category?: string;
  id?: string;
}

export function queryPluginsList(params: ListParams) {
  return axios.get<PluginsListRes>(`/plugins`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function deletePlugins(data: any) {
  return axios.delete(`/plugins`, { data });
}

export function createPlugins(data: PostFormData) {
  return axios.post(`/plugins`, data);
}

export function updatePlugins(data: PostFormData) {
  return axios.put(`/plugins/${data.id}`, data);
}
