import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { PerspectiveRowData } from '../config/interface';

export interface QueryType extends Pagination {
  name?: string;
  sort?: string[];
  _group?: string[];
}

export interface ResultType {
  filters: unknown;
  items: PerspectiveRowData[];
  pagination: Pagination;
}
export function queryPerspectives(params: QueryType) {
  return axios.get<ResultType>('/perspectives', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemPerspective(params: { id: string }) {
  return axios.get(`/perspectives/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createPerspective(data: any) {
  return axios.post('/perspectives', data);
}
export function updatePerspective(data: { id: string }) {
  return axios.put(`/perspectives/${data.id}`, data);
}
export function deletePerspective(data: { id: string }) {
  return axios.delete(`/perspectives/${data.id}`, data);
}
