import axios from 'axios';
import qs from 'query-string';
import { Pagination, ListQuery } from '@/types/global';
import router from '@/router';
import _ from 'lodash';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import { VariableRow, VariableFormData } from '../config/interface';

export { GlobalNamespace, NAMESPACES };

export const VARIABLE_API = 'variables';

const generateVariableAPI = (params: { namespace: string; name?: string }) => {
  const { name, namespace } = params;
  if (name) {
    return `/${NAMESPACES}/${namespace}/${VARIABLE_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${VARIABLE_API}`;
};

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

export interface QueryType extends ListQuery {
  projectID?: string;
  name?: string;
  namespace: string;
}
export interface ResultType {
  items: VariableRow[];
  pagination: Pagination;
}

export const queryProjectVairables = (params: QueryType) => {
  const url = generateVariableAPI({
    namespace: params.namespace
  });
  return axios.get<ResultType>(url, {
    params: _.omit(params, ['namespace']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryVariables = (params: QueryType) => {
  const url = generateVariableAPI({
    namespace: params.namespace
  });
  return axios.get<ResultType>(url, {
    params: _.omit(params, ['namespace']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryEnvironmentVariables = (params: QueryType) => {
  const url = generateVariableAPI({
    namespace: params.namespace
  });

  return axios.get<ResultType>(url, {
    params: {
      ..._.omit(params, ['namespace'])
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryItemVariable = (params: {
  name: string;
  namespace: string;
}) => {
  const url = generateVariableAPI(params);
  return axios.get(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createVariable = (params: { data: object; namespace: string }) => {
  const url = generateVariableAPI({
    namespace: params.namespace
  });
  return axios.post(`${url}`, params.data);
};

export const updateVariable = (params: { data: object; namespace: string }) => {
  const url = generateVariableAPI({
    namespace: params.namespace
  });

  return axios.put(`${url}`, params.data);
};

export const deleteVariable = (params: { name: string; namespace: string }) => {
  const url = generateVariableAPI(params);
  return axios.delete(url);
};
