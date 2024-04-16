import axios from 'axios';
import qs from 'query-string';
import router from '@/router';
import _ from 'lodash';
import {
  Pagination,
  ListResult,
  ListQuery,
  DataListItem,
  RequestCallbackArgs
} from '@/types/global';
import ResourceKinds, {
  GlobalNamespace,
  NAMESPACES,
  apiVersion
} from '@/views/config/resource-kinds';

import {
  ProjectRowData,
  ProjectFormData,
  ProjectRolesRowData
} from '../config/interface';

export { apiVersion, ResourceKinds, GlobalNamespace, NAMESPACES };

export const PROJECT_API = 'projects';

export const SUBJECT_API = 'subjects';

const generateProjectAPI = (params: { namespace?: string; name?: string }) => {
  const { namespace, name } = params;
  if (name) {
    return `/${NAMESPACES}/${namespace}/${PROJECT_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${PROJECT_API}`;
};

const generateProjectSubjectAPI = (params: {
  namespace: string;
  name: string;
}) => {
  const { namespace, name } = params;
  return `/${NAMESPACES}/${namespace}/${PROJECT_API}/${name}/${SUBJECT_API}`;
};

export const PROJECT_API_PREFIX = () => {
  const { projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}`;
};
export interface QueryType extends ListQuery {
  sort?: string[];
}

export const queryProjects = (params: QueryType, token?) => {
  const url = generateProjectAPI({
    namespace: params.namespace
  });
  return axios.get<ListResult<ProjectRowData>>(url, {
    params: _.omit(params, ['namespace']),
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createProject = (params: RequestCallbackArgs) => {
  const url = generateProjectAPI({
    namespace: params.namespace
  });
  return axios.post(url, params.data);
};
export const deleteProjects = (data: { name: string; namespace: string }) => {
  const url = generateProjectAPI({
    namespace: data.namespace,
    name: data.name
  });
  return axios.delete(url);
};

export const updateProject = (params: RequestCallbackArgs) => {
  const url = generateProjectAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.put(url, params.data);
};

export const queryItemProject = (params: {
  name: string;
  namespace: string;
}) => {
  const url = generateProjectAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.get(url);
};

export const queryProjectSubjects = (
  params: ListQuery & { projectName: string }
) => {
  const url = generateProjectSubjectAPI({
    namespace: params.namespace as string,
    name: params.projectName
  });
  return axios.get<ListResult<ProjectRolesRowData>>(url, {
    params: _.omit(params, ['namespace', 'projectName']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const addProjectSubjects = (
  params: RequestCallbackArgs & { projectName: string }
) => {
  const url = generateProjectSubjectAPI({
    namespace: params.namespace,
    name: params.projectName
  });
  return axios.put(url, params.data);
};

export const deleteProjectSubjects = (params: {
  name: string;
  namespace: string;
}) => {
  const url = generateProjectSubjectAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.delete(url);
};
