import axios, { AxiosRequestConfig } from 'axios';
import { omit } from 'lodash';
import qs from 'query-string';

// by project id
export interface listParams {
  page: number;
  perPage: number;
  resourceID: string;
  version?: string;
  query?: string;
  packageSystem?: string;
  direct?: string;
  withIssues?: string;
}
export interface ComponentDetails {
  id: string;
  resourceID: string;
  version: string;
}
// query history dependencies
export function queryHistoryDependencies(params: listParams) {
  return axios.get(`/resources/${params.resourceID}/scan-histories`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// query dependencies tree latest
export function queryDependenciesTree(params: listParams) {
  return axios.get(`/resources/${params.resourceID}/dependencies-graph`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// query dependencies list latest
export function queryDependenciesList(params: listParams) {
  return axios.get(`/resources/${params.resourceID}/dependency/latest`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// query version dependencies tree
export function queryVersionDependenciesTree(params: listParams) {
  return axios.get(`/resources/${params.resourceID}/dependencies-graph`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// query version dependencies list
export function queryVersionDependenciesList(params: listParams) {
  return axios.get(`/software-packages`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function exportProjectSbom(params: {
  resourceID: string;
  versionId: string;
}) {
  return `/v1/resources/${params.resourceID}/dependencies-sbom?version=${params.versionId}`;
}
// query dependency list
export function queryDependencyList(params: listParams) {
  return axios.get(`/software-packages`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// query component detail
export function queryComponentDetail(params: ComponentDetails) {
  return axios.get(`/software-packages/${params.id}`, {
    params: omit(params, ['id']),
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
