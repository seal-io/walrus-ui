import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import {
  ListQuery,
  RequestCallbackArgs,
  DataListItem,
  ListResult
} from '@/types/global';
import router from '@/router';
import ResourKinds, {
  GlobalNamespace,
  apiVersion,
  NAMESPACES
} from '@/views/config/resource-kinds';
import { ConnectorRowData, ConnectorFormData } from '../config/interface';

export { GlobalNamespace, NAMESPACES, ResourKinds, apiVersion };

export const CONNECTOR_API = 'connectors';

const generateConnectorAPI = (params: { name?: string; namespace: string }) => {
  const { name, namespace } = params;
  if (name) {
    return `${NAMESPACES}/${namespace}/${CONNECTOR_API}/${name}`;
  }
  return `${NAMESPACES}/${namespace}/${CONNECTOR_API}`;
};

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

export interface QueryType extends ListQuery {
  sort?: string;
}

export interface ResultType {
  filters: unknown;
  items: ConnectorRowData[];
}

export function queryConnectors(params: ListQuery, cancelToken?) {
  const url = generateConnectorAPI({
    name: params.name,
    namespace: params.namespace
  });

  return axios.get<ListResult<ConnectorRowData>>(url, {
    params: _.omit(params, ['name', 'namespace']),
    cancelToken,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryItemConnector(params: {
  name: string;
  namespace: string;
}) {
  const url = generateConnectorAPI(params);
  return axios.get(url);
}
export function createConnector(params: RequestCallbackArgs) {
  const url = generateConnectorAPI({
    namespace: params.namespace
  });
  return axios.post(url, params.data);
}

export function updateConnector(params: RequestCallbackArgs) {
  const url = generateConnectorAPI({
    name: params.name,
    namespace: params.namespace
  });
  return axios.put(`${url}`, params.data);
}

export function deleteConnector(data: { name: string; namespace: string }) {
  const url = generateConnectorAPI(data);
  return axios.delete(url);
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
