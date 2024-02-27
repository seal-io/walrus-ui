import axios from 'axios';
import { omit } from 'lodash';
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
