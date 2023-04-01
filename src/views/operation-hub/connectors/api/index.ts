import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { ConnectorRowData, ConnectorFormData } from '../config/interface';

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}

export interface ResultType {
  filters: unknown;
  items: ConnectorRowData[];
  pagination: Pagination;
}
export function queryConnectors(params: QueryType, cancelToken?) {
  return axios.get<ResultType>('/connectors', {
    params,
    cancelToken,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemConnector(params: { id: string }) {
  return axios.get(`/connectors/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createConnector(data: ConnectorFormData) {
  return axios.post('/connectors', data);
}

export function updateConnector(data: ConnectorFormData) {
  return axios.put(`/connectors/${data.id}`, data);
}
export function deleteConnector(data: Array<{ id: string | number }>) {
  return axios.delete(`/connectors`, { data });
}
export function reinstallFinOpsTools(data: ConnectorFormData) {
  return axios.post(`/connectors/${data.id}/apply-cost-tools`, data);
}
export function syncFinOpsData(data: ConnectorFormData) {
  return axios.post(`/connectors/${data.id}/sync-cost-data`, data);
}
