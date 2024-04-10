import axios from 'axios';
import qs from 'query-string';
import { Pagination, ListQuery } from '@/types/global';
import _ from 'lodash';
import router from '@/router';
import { CatalogRowData, CatalogFormData } from '../config/interface';

export const CatalogAPI = 'catalogs';

export const GlobalNamespace = 'walrus-system';

const NAMESPACES = 'namespaces';

export const generateListAPI = (namespace: string) => {
  return `/${NAMESPACES}/${namespace}/${CatalogAPI}`;
};

export const PROJECT_API_PREFIX = () => {
  return `/projects/${router.currentRoute.value.params.projectId}`;
};

export const isProjectContext = () => {
  return !!router.currentRoute.value.params.projectId;
};

export interface QueryType extends ListQuery {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}

export interface ResultType {
  filters: unknown;
  items: CatalogRowData[];
  pagination: Pagination;
}

export interface FormDataPR {
  connectorID: string;
  repository: string;
  branch: string;
  path: string;
  content: string;
}

export function queryCatalogs(params: QueryType) {
  const url = `/${NAMESPACES}/${params.namespace}/${CatalogAPI}`;
  return axios.get<ResultType>(url, {
    params: _.omit(params, ['namespace']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemCatalog(params: { name: string; namespace: string }) {
  const url = `/${NAMESPACES}/${params.namespace}/${CatalogAPI}/${params.name}`;
  return axios.get(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createCatalog(data: CatalogFormData) {
  const url = `/${NAMESPACES}/${data.metadata.namespace}/${CatalogAPI}`;
  return axios.post(url, data);
}

export function deleteCatalogs(data: ListQuery) {
  const url = `/${NAMESPACES}/${data.namespace}/${CatalogAPI}/${data.name}`;
  return axios.delete(url, { data });
}
export function updateCatalog(data: CatalogFormData) {
  const url = `/${NAMESPACES}/${data.metadata.namespace}/${CatalogAPI}/${data.metadata.name}`;
  return axios.put(url, data);
}
export function refreshCatalog(data: {
  namespace: string;
  name: string;
  item: object;
}) {
  const url = `/${NAMESPACES}/${data.namespace}/${CatalogAPI}/${data.name}`;
  return axios.put(`${url}`, data.item);
}

export default {};
