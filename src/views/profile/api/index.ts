import axios from 'axios';
import qs from 'query-string';
import { ListResult } from '@/types/global';
import { RowData } from '../config/interface';

export interface FormDataType {
  name: string;
  expiration: any;
  id?: string;
  accessToken?: string;
  createTime?: string;
}
export interface queryParams {
  page: number;
  perPage?: number;
}

export function queryTokens(params: queryParams) {
  return axios.get<FormDataType[]>('/tokens', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function createTokens(data: FormDataType) {
  return axios.post<FormDataType[]>('/tokens', data);
}

export function deleteTokens(id) {
  return axios.delete(`/tokens/${id}`);
}

// ============= subjects ===========
export function querySubjects(params: queryParams) {
  return axios.get<ListResult<RowData>>('/subjects', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const deleteSubjects = (data) => {
  return axios.delete(`/subjects`, { data });
};
export const createSubject = (data) => {
  return axios.post(`/subjects`, data);
};

export const updateSubject = (data) => {
  return axios.put(`/subjects/${data.id}`, data);
};

export function queryRoles(params: { kind: string }) {
  return axios.get('/roles', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
