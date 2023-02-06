import { Pagination } from '@/types/global';
import axios, { AxiosResponse } from 'axios';
import qs from 'query-string';

export interface FormType {
  id?: string;
  name: string;
  url: string;
  provider?: string;
  username: string;
  password: string;
  insecure: boolean;
}

export interface RegistryItem {
  id: string;
  name: string;
  url: string;
  createTime: string;
  updateTime: string;
  provider: string;
  username: string;
  password: string;
}
interface tableListRes {
  items: RegistryItem[];
  pagination: Pagination;
}
interface ListParams {
  provider?: string;
  page: number;
  perPage: number;
}
export const submitFormData = (data: FormType) => {
  return axios.post('/container-registries', data);
};
export const getRegistriesList = (params?: ListParams) => {
  return axios.get<tableListRes>('/container-registries', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
};
export function deleteRegistriesItem(data) {
  return axios.delete(`/container-registries`, { data });
}
export const updateFormData = (data: FormType) => {
  return axios.put(`/container-registries/${data.id}`, data);
};
export const getFormData = (params: { id: string | number }) => {
  return axios.get(`/container-registries/${params.id}`);
};
export const getRegistyRepoTags = (
  params: { id: string | number },
  cancelToken
) => {
  return axios.get(`/container-registries/${params.id}/repository-tags`, {
    params,
    cancelToken,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
};
export function testFormData(data: FormType) {
  return axios.post('/container-registries/_/test', { ...data });
}
