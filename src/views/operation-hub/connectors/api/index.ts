import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { ConnectorRowData, ConnectorFormData } from '../config/interface';

export const CONNECTOR_API = '/connectors';

export const PROJECT_API_PREFIX = () => {
  return `/projects/${router.currentRoute.value.params.projectId}`;
};

export const isProjectContext = () => {
  return !!router.currentRoute.value.params.projectId;
};

export const getPermissionRouteParams = () => {
  const { params } = router.currentRoute.value;
  return { projectID: params?.projectId };
};
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
  let url = CONNECTOR_API;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}`;
  }
  return axios.get<ResultType>(`${url}`, {
    params,
    cancelToken,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemConnector(params: { id: string }) {
  let url = `${CONNECTOR_API}/${params.id}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}/${params.id}`;
  }
  return axios.get(`${url}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createConnector(data: ConnectorFormData) {
  let url = CONNECTOR_API;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}`;
  }
  return axios.post(`${url}`, data);
}

export function updateConnector(data: ConnectorFormData) {
  let url = `${CONNECTOR_API}/${data.id}`;

  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}/${data.id}`;
  }
  return axios.put(`${url}`, data);
}

export function deleteConnector(data: {
  items: Array<{ id: string | number }>;
}) {
  let url = CONNECTOR_API;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}`;
  }
  return axios.delete(`${url}`, { data });
}

export function reinstallFinOpsTools(data: ConnectorFormData) {
  let url = `${CONNECTOR_API}/${data.id}/apply-cost-tools`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}/${data.id}/apply-cost-tools`;
  }
  return axios.post(`${url}`);
}

export function syncFinOpsData(data: ConnectorFormData) {
  let url = `${CONNECTOR_API}/${data.id}/sync-cost-data`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${CONNECTOR_API}/${data.id}/sync-cost-data`;
  }
  return axios.post(`${url}`);
}
