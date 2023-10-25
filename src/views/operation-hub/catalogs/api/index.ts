import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { CatalogRowData, CatalogFormData } from '../config/interface';

export const CatalogAPI = '/catalogs';

export const PROJECT_API_PREFIX = () => {
  return `/projects/${router.currentRoute.value.params.projectId}`;
};

export const isProjectContext = () => {
  return !!router.currentRoute.value.params.projectId;
};

export interface QueryType extends Pagination {
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
  let url = CatalogAPI;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}`;
  }
  return axios.get<ResultType>(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemCatalog(params: { id: string }) {
  let url = `${CatalogAPI}/${params.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}/${params.id}`;
  }
  return axios.get(url, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createCatalog(data: CatalogFormData) {
  let url = CatalogAPI;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}`;
  }
  return axios.post(url, data);
}
export function deleteCatalogs(data: { items: Record<string, any>[] }) {
  let url = CatalogAPI;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}`;
  }
  return axios.delete(url, { data });
}
export function updateCatalog(data: CatalogFormData) {
  let url = `${CatalogAPI}/${data.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}/${data.id}`;
  }
  return axios.put(url, data);
}
export function refreshCatalog(data: { id: string }) {
  let url = `${CatalogAPI}/${data.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CatalogAPI}/${data.id}`;
  }
  return axios.post(`${url}/refresh`);
}

export default {};
