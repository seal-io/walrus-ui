import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { EnvironmentRow, EnvironFormData } from '../config/interface';

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
}

export interface ResultType {
  items: EnvironmentRow[];
  pagination: Pagination;
}
export function queryEnvironments(params: QueryType) {
  return axios.get<ResultType>('/environments', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryItemEnvironments(params: { id: string }) {
  return axios.get(`/environments/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function createEnvironment(data: EnvironFormData) {
  return axios.post('/environments', data);
}

export function updateEnvironment(data: EnvironFormData) {
  return axios.put(`/environments/${data.id}`, data);
}
