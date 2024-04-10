import axios from 'axios';
import qs from 'query-string';
import router from '@/router';
import _ from 'lodash';
import { Pagination, ListResult, ListQuery } from '@/types/global';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import {
  ProjectRowData,
  ProjectFormData,
  ProjectRolesRowData
} from '../config/interface';

export const PROJECT_API = 'projects';

export { GlobalNamespace, NAMESPACES };

const generateProjectAPI = (params: { namespace?: string; name?: string }) => {
  const { namespace, name } = params;
  if (name) {
    return `/${NAMESPACES}/${GlobalNamespace}/${PROJECT_API}/${name}`;
  }
  return `/${NAMESPACES}/${GlobalNamespace}/${PROJECT_API}`;
};

export const PROJECT_API_PREFIX = () => {
  const { projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}`;
};
export interface QueryType extends ListQuery {
  sort?: string[];
}

export interface ResultType {
  items: ProjectRowData[];
  pagination: Pagination;
}

export const queryProjects = (params: QueryType, token?) => {
  const url = generateProjectAPI({});
  return axios.get<ResultType>(url, {
    params,
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createProject = (data: ProjectFormData) => {
  const url = generateProjectAPI({});
  return axios.post(url, data);
};
export const deleteProjects = (data: { items: Record<string, any>[] }) => {
  return axios.delete(`/projects`, { data });
};

export const updateProject = (data: ProjectFormData) => {
  return axios.put(`/projects/${data.id}`, data);
};

export const queryItemProject = (params) => {
  return axios.get(`/projects/${params.id}`);
};

export const queryProjectSubjects = (params) => {
  return axios.get<ListResult<ProjectRolesRowData>>(
    `${PROJECT_API_PREFIX()}/subjects`,
    {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const addProjectSubjects = (data) => {
  return axios.post(`${PROJECT_API_PREFIX()}/subjects/_/batch`, data);
};

export const deleteProjectSubjects = (data: {
  items: Record<string, any>[];
}) => {
  return axios.delete(`${PROJECT_API_PREFIX()}/subjects`, { data });
};
