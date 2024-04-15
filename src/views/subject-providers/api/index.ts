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

export const SUBJECT_PROVIDERS_API = 'subjectproviders';

const generateSubjectProvidersAPI = (params: {
  namespace?: string;
  name?: string;
}) => {
  const { namespace, name } = params;
  if (name) {
    return `/${NAMESPACES}/${namespace}/${SUBJECT_PROVIDERS_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${SUBJECT_PROVIDERS_API}`;
};

export interface queryParams extends ListQuery {
  page: number;
  perPage?: number;
}

// ============= subjects ===========
export function querySubjectProviders(params: queryParams) {
  const url = generateSubjectProvidersAPI({
    namespace: GlobalNamespace
  });
  return axios.get<ListResult<DataListItem>>(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const deleteSubjectProvider = (param: {
  name: string;
  namespace: string;
}) => {
  const url = generateSubjectProvidersAPI({
    namespace: param.namespace,
    name: param.name
  });
  return axios.delete(url);
};

export const createSubjectProvider = (params: RequestCallbackArgs) => {
  const url = generateSubjectProvidersAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.post(url, params.data);
};

export const updateSubjectProvider = (params: RequestCallbackArgs) => {
  const url = generateSubjectProvidersAPI({
    namespace: params.namespace,
    name: params.name
  });
  return axios.put(url, params.data);
};
