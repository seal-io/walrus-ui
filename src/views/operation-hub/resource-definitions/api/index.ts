import axios from 'axios';
import { omit } from 'lodash';
import qs from 'query-string';
import { Pagination, ListQuery } from '@/types/global';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import { ResourceDefinitionFormData } from '../config/interface';

export { GlobalNamespace, NAMESPACES };

export const RESOURCE_DEFINITION_API = 'resourcedefinitions';

const generateDefinitionAPI = (params: {
  name?: string;
  namespace: string;
}) => {
  const { name, namespace } = params;

  if (name) {
    return `/${NAMESPACES}/${namespace}/${RESOURCE_DEFINITION_API}/${name}`;
  }
  return `/${NAMESPACES}/${namespace}/${RESOURCE_DEFINITION_API}`;
};

export interface QueryType extends ListQuery {
  extract?: string[];
  sort?: string[];
  _group?: string[];
  name: string;
  namespace: string;
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
  const url = generateDefinitionAPI({
    namespace: params.namespace
  });

  return axios.get<ResultType>(url, {
    params: omit(params, ['namespace']),
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

export function queryItemResourceDefinition(
  params: { id: string },
  token?: any
) {
  return axios.get(`${RESOURCE_DEFINITION_API}/${params.id}`, {
    cancelToken: token
  });
}

export function queryItemDefinitionResources(params: {
  id: string;
  pageParams: any;
}) {
  return axios.get(`${RESOURCE_DEFINITION_API}/${params.id}/resources`, {
    params: params.pageParams,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const batchDeployDefinitionResources = (data: {
  id: string;
  items: { id: string }[];
  reuseAttributes: boolean;
  changeComment: string;
}) => {
  return axios.post(
    `${RESOURCE_DEFINITION_API}/${data.id}/resources/_/upgrade`,
    { ...omit(data, ['id']) }
  );
};

export const batchDeleteDefinitionResource = (data: {
  data: { items: Array<{ id: string }> };
  id: string;
  withoutCleanup: boolean;
}) => {
  return axios.delete(
    `${RESOURCE_DEFINITION_API}/${data.id}/resources?${qs.stringify({
      withoutCleanup: data.withoutCleanup
    })}`,
    {
      data: data.data
    }
  );
};

export const batchDeployService = (data: {
  items: { id: string }[];
  reuseAttributes: boolean;
  changeComment: string;
  projectID: string;
  environmentID: string;
}) => {
  return axios.post(
    `/projects/${data.projectID}/environments/${data.environmentID}/resources/_/upgrade`,
    {
      items: data.items,
      reuseAttributes: data.reuseAttributes,
      changeComment: data.changeComment
    }
  );
};
