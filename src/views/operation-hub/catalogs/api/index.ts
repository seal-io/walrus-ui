import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { CatalogRowData, CatalogFormData } from '../config/interface';

export const CatalogAPI = '/catalogs';

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
  return axios.get<ResultType>('/catalogs', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemCatalog(params: { id: string }) {
  return axios.get(`/catalogs/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createCatalog(data: CatalogFormData) {
  return axios.post('/catalogs', data);
}
export function deleteCatalogs(data: { items: Record<string, any>[] }) {
  return axios.delete('/catalogs', { data });
}
export function updateCatalog(data: CatalogFormData) {
  return axios.put(`/catalogs/${data.id}`, data);
}
export function refreshCatalog(data: { id: string }) {
  return axios.post(`/catalogs/${data.id}/refresh`);
}

export default {};
