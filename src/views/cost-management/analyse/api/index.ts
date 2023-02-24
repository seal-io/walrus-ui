import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { PerspectiveRowData } from '../config/interface';

export interface FieldValueType {
  fieldName: string;
  startTime: string;
  endTime: string;
}
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

export function queryPerspectiveField(params: FieldValueType) {
  return axios.get(`/perspectives/_/field-values`, {
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
  return axios.delete(`/perspectives/${data.id}`, { data });
}

export function queryPerspectiveData(data: any) {
  return axios.post('/costs/_/allocation-costs', data);
}
export function queryAllPerspectiveSummary(data: any) {
  return axios.post('/costs/_/summary-costs', data);
}
export function queryProjectPerspectiveSummary(data: any) {
  return axios.post('/costs/_/summary-project-costs', data);
}
export function queryClusterPerspectiveSummary(data: any) {
  return axios.post('/costs/_/summary-cluster-costs', data);
}
