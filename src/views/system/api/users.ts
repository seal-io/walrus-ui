import axios from 'axios';
import qs from 'query-string';
import {
  ListResult,
  DataListItem,
  ListQuery,
  RequestCallbackArgs
} from '@/types/global';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';

export { GlobalNamespace, NAMESPACES };

export const SUBJECT_API = 'subjects';

const generateSubjectAPI = (params: { namespace?: string; name?: string }) => {
  const { namespace, name } = params;
  if (name) {
    return `/${NAMESPACES}/${GlobalNamespace}/${SUBJECT_API}/${name}`;
  }
  return `/${NAMESPACES}/${GlobalNamespace}/${SUBJECT_API}`;
};

export interface queryParams extends ListQuery {
  page: number;
  perPage?: number;
}

// ============= subjects ===========
export function querySubjects(params: queryParams) {
  const url = generateSubjectAPI({
    namespace: GlobalNamespace
  });
  return axios.get<ListResult<DataListItem>>(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const deleteSubjects = (param: { name: string; namesspace: string }) => {
  const url = generateSubjectAPI({
    namespace: param.namesspace,
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
