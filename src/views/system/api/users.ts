import axios from 'axios';
import qs from 'query-string';
import { ListResult } from '@/types/global';
import { RowData } from '../config/interface';

export interface queryParams {
  page: number;
  perPage?: number;
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
