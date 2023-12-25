import axios from 'axios';
import { pick } from 'lodash';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { ResourceDefinitionFormData } from '../config/interface';

export const RESOURCE_DEFINITION_API = '/resource-definitions';

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}

export interface ResultType {
  filters: unknown;
  items: any[];
  pagination: Pagination;
}

export function queryResourceDefinitions(
  params: QueryType & { withGlobal?: boolean },
  token?: any
) {
  return axios.get<ResultType>(RESOURCE_DEFINITION_API, {
    params,
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function deleteResourceDefinitions(data: { items: { id: string }[] }) {
  return axios.delete(RESOURCE_DEFINITION_API, { data });
}
export function createResourceDefinition(data: ResourceDefinitionFormData) {
  return axios.post(RESOURCE_DEFINITION_API, data);
}
export function upateResourceDefinition(params: { id: string; data: any }) {
  return axios.put(`${RESOURCE_DEFINITION_API}/${params.id}`, params.data);
}

export function queryItemResourceDefinition(params: { id: string }) {
  return axios.get(`${RESOURCE_DEFINITION_API}/${params.id}`);
}
