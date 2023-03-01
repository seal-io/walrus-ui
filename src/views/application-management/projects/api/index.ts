import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { ProjectRowData, ProjectFormData } from '../config/interface';

export interface QueryType extends Pagination {
  sort?: string[];
}

export interface ResultType {
  items: ProjectRowData[];
  pagination: Pagination;
}

export const queryProjects = (params: QueryType) => {
  return axios.get<ResultType>('/projects', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createProject = (data: ProjectFormData) => {
  return axios.post(`/projects`, data);
};

export const updateProject = (data: ProjectFormData) => {
  return axios.put(`/projects/${data.id}`, data);
};

export const queryItemProject = (params) => {
  return axios.get(`/projects/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationsInProject = (params) => {
  return axios.get(`/projects/${params.id}/applications`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
