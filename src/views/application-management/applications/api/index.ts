import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { AppRowData } from '../config/interface';

// interface ParamsType extends Pagination {}
export interface ResultType {
  items: AppRowData[];
  pagination: Pagination;
}
export interface QueryType extends Pagination {
  projectId: string;
}
export const queryApplications = (params: QueryType) => {
  return axios.get<ResultType>(`/projects/${params.projectId}/applications`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createApplication = (data) => {
  return axios.post(`/applications`, data);
};

export const updateApplication = (data) => {
  return axios.put(`/applications/${data.id}`, data);
};

export const queryItemApplication = (params) => {
  return axios.get(`/applications/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

// =========history================
export const queryApplicationRevisions = (params: Pagination) => {};
