import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { VariableRow, VariableFormData } from '../config/interface';

export const VARIABLE_API = '/variables';

export const PROJECT_API_PREFIX = () => {
  const { projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}`;
};

export const ENVIRONMENT_API_PREFIX = () => {
  const { environmentId, projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}/environments/${environmentId}`;
};

export const getPermissionRouteParams = () => {};

const isEnviromentContext = () => {
  return !!router.currentRoute.value.params.environmentId;
};

const isProjectContext = () => {
  return !!router.currentRoute.value.params.projectId && !isEnviromentContext();
};

export interface QueryType extends Pagination {
  projectID?: string;
}
export interface ResultType {
  items: VariableRow[];
  pagination: Pagination;
}

export const queryVariables = (params: QueryType) => {
  let url = VARIABLE_API;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${VARIABLE_API}`;
  }
  if (isEnviromentContext()) {
    url = `${ENVIRONMENT_API_PREFIX()}${VARIABLE_API}`;
  }
  return axios.get<ResultType>(`${url}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryItemVariable = (params: { id: string }) => {
  let url = `${VARIABLE_API}/${params.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${VARIABLE_API}/${params.id}`;
  }
  if (isEnviromentContext()) {
    url = `${ENVIRONMENT_API_PREFIX()}${VARIABLE_API}/${params.id}`;
  }
  return axios.get(`${url}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const createVariable = ({ data }) => {
  let url = `${VARIABLE_API}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${VARIABLE_API}`;
  }
  if (isEnviromentContext()) {
    url = `${ENVIRONMENT_API_PREFIX()}${VARIABLE_API}`;
  }
  return axios.post(`${url}`, data);
};

export const updateVariable = ({ data }) => {
  let url = `${VARIABLE_API}/${data.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${VARIABLE_API}/${data.id}`;
  }
  if (isEnviromentContext()) {
    url = `${ENVIRONMENT_API_PREFIX()}${VARIABLE_API}/${data.id}`;
  }
  return axios.put(`${url}`, data);
};

export const deleteVariable = ({ data }) => {
  let url = `${VARIABLE_API}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${VARIABLE_API}`;
  }
  if (isEnviromentContext()) {
    url = `${ENVIRONMENT_API_PREFIX()}${VARIABLE_API}`;
  }
  return axios.delete(`${url}`, { data });
};
