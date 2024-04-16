import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import {
  ListResult,
  DataListItem,
  ListQuery,
  RequestCallbackArgs
} from '@/types/global';
import ResourceKinds, {
  GlobalNamespace,
  NAMESPACES,
  apiVersion
} from '@/views/config/resource-kinds';

export { GlobalNamespace, NAMESPACES, ResourceKinds, apiVersion };

export const SUBJECT_API = 'subjects';

const generateSubjectAPI = (params: { namespace?: string; name?: string }) => {
  const { namespace, name } = params;
  if (name) {
    return `/${NAMESPACES}/${GlobalNamespace}/${SUBJECT_API}/${name}`;
  }
  return `/${NAMESPACES}/${GlobalNamespace}/${SUBJECT_API}`;
};

// ============= subjects ===========
export function querySubjects(params: ListQuery) {
  const url = generateSubjectAPI({
    namespace: GlobalNamespace
  });
  return axios.get<ListResult<DataListItem>>(url, {
    params: _.omit(params, ['namespace']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const deleteSubjects = (param: { name: string; namespace: string }) => {
  const url = generateSubjectAPI({
    namespace: param.namespace,
    name: param.name
  });
  return axios.delete(url);
};

export const createSubject = (params: RequestCallbackArgs) => {
  const url = generateSubjectAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.post(url, params.data);
};

export const updateSubject = (params: RequestCallbackArgs) => {
  const url = generateSubjectAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.put(url, params.data);
};

export function queryRoles(params: { kind: string }) {
  return axios.get('/roles', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
