import { Pagination } from '@/types/global';
import func from '@/utils/func';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';

export interface licenseGroupRow {
  id: string | number;
  name: string;
  builtin: boolean;
  disabled?: boolean;
  tags: string[];
  description: string;
  label?: string;
  licenseID?: string;
  value?: string;
}
export interface licenseBindingsRow extends licenseGroupRow {
  id: string;
  licenseGroupID: string;
  licenseID: string;
}
export interface licenseBindingsRes {
  filters: unknown;
  items: licenseBindingsRow[];
  pagination: Pagination;
}

export interface tableRowRes {
  filters: unknown;
  items: licenseGroupRow[];
  pagination: Pagination;
}
export interface licenseGroupParams {
  page: number;
  perPage: number;
  name?: string;
  query?: string;
  builtin?: boolean | string;
}

export interface licenseBindingsParams {
  page?: number;
  perPage?: number;
  groupID?: string;
}

export interface licensePostParams {
  id?: string;
  name: string;
  description: string;
  link: string;
  tags: Array<string>;
  builtin?: boolean;
}
export interface licenseGroupPostParams {
  name: string;
  description: string;
  id?: string;
}

interface requestType extends AxiosRequestConfig {
  id: string | Array<string>;
}

interface postLicenseType extends AxiosRequestConfig {
  id: string;
  name: string;
  description: string;
  link: string;
}
export function queryLicenseGroups(params: licenseGroupParams) {
  return axios.get<tableRowRes>('/license-tags', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryLicenseGroupsItem(id) {
  return axios.get<licenseGroupRow>(`/license-tags/${id}`);
}

export function queryLicenseList(params: licenseGroupParams) {
  return axios.get<tableRowRes>('/licenses', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryLicenseBindings(params: licenseBindingsParams) {
  return axios.get<licenseBindingsRes>(`/licenseBindings`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function queryLicenseBindingsByGroup(id) {
  return axios.get<licenseBindingsRes>(`/licenseBindings/${id}`);
}
export function createGroups(data: licenseGroupPostParams) {
  return axios.post(`/license-tags`, data);
}
export function updateLicenseGroup(data: licenseGroupPostParams) {
  return axios.put(`/license-tags/${data.id}`, data);
}
export function deleteGroups(data: any) {
  return axios.delete(`/license-tags`, { data });
}
export function createLicense(data: licensePostParams) {
  return axios.post(`/licenses`, data);
}
export function updateLicense(data: licensePostParams) {
  return axios.put(`/licenses/${data.id}`, data);
}
export function queryLicenseInfo(id) {
  return axios.get(`/licenses/${id}`);
}
export function createLicenseBindings(
  data: Array<{ id: string | number; tags: string[] }>
) {
  return axios.post(`/licenses`, data);
}
export function deleteLicenseBindings(data) {
  return axios.delete(`/licenses`, { data });
}
export function deleteLicense(data: any) {
  return axios.delete(`/licenses`, { data });
}
export function updateBatchLicense(
  data: Array<{ id: string | number; tags: string[] }>
) {
  return axios.put(`/licenses`, data);
}
export function queryTagList() {
  return axios.get('/licenses/_/tags');
}
export function queryTagNameByCategory() {
  return axios.get('/complianceLicenses/tagNamesByCategory');
}
export function queryTagCategory() {
  return axios.get('/license-tags/_/categories');
}
