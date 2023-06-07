import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { ConnectorRowData, ConnectorFormData } from '../config/interface';

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
  return axios.post(
    `/connectors?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
}

export function updateConnector(data: ConnectorFormData) {
  return axios.put(
    `/connectors/${data.id}?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
}
export function deleteConnector(data: Array<{ id: string | number }>) {
  return axios.delete(
    `/connectors?${qs.stringify(getPermissionRouteParams())}`,
    { data }
  );
}
export function reinstallFinOpsTools(data: ConnectorFormData) {
  return axios.post(
    `/connectors/${data.id}/apply-cost-tools?${qs.stringify(
      getPermissionRouteParams()
    )}`,
    data
  );
}
export function syncFinOpsData(data: ConnectorFormData) {
  return axios.post(
    `/connectors/${data.id}/sync-cost-data?${qs.stringify(
      getPermissionRouteParams()
    )}`,
    data
  );
}
