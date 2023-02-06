import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { dataInfoModel } from '@/views/report/api/report';
import { withIssuesList } from '@/views/projects/config';

export interface TableRowData {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  selectors: string[];
  description: string;
  resourceCount: number;
}
export interface FormDataType {
  id?: string;
  name: string;
  selectors: string[];
  description: string;
}
export interface ListParams {
  page: number;
  perPage: number;
  name?: string;
  tags: string[];
}

interface ListResult {
  items: TableRowData[];
  pagination: Pagination;
}
export interface ComponentsParams {
  id: string;
  page?: number;
  perPage?: number;
  sort?: string;
  query?: string;
  withIssues?: string;
}

export function queryAppsList(params: ListParams) {
  return axios.get<ListResult>('/applications', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function submitFormData(data: FormDataType) {
  return axios.post(`/applications`, data);
}
export function deleteApps(data) {
  return axios.delete(`/applications`, { data });
}
export function updateFormData(data: FormDataType) {
  return axios.put(`/applications/${data.id}`, data);
}
export function queryAppsItem(params: { id: string }) {
  return axios.get(`/applications/${params.id}`);
}
export function queryAppsResources(params: { id: string }) {
  return axios.get(`/applications/${params.id}/resources`);
}
export function queryAppsDependenciesGrap(params: ComponentsParams) {
  return axios.get(`/applications/${params.id}/dependencies-graph`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryAppsDependencies(params: ComponentsParams) {
  return axios.get(`/applications/${params.id}/dependencies`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryResourceTags() {
  return axios.get('/resources/_/tags');
}

export function queryApplicationViolations(params: { id: string }) {
  return axios.get<dataInfoModel>(`/applications/${params.id}/report`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function exportProjectSbom(params: { id: string; merge?: boolean }) {
  return `/v1/applications/${params.id}/sbom?merge=${params.merge}`;
  // return axios.get(`/applications/${params.id}/sbom?merge=${params.merge}`)
}

interface ParamsType {
  id: string;
  type: string;
  start?: string;
  end?: string;
  timeUnit?: string; // day week month quarter year
}

export interface SeriesItem {
  statTime: string;
  metrics: Array<{
    issueHighCount: string;
    issueLowCount: string;
    issueMediumCount: string;
    issueTotalCount: string;
    issueHighAvgFixTime: string;
    issueLowAvgFixTime: string;
    issueMediumAvgFixTime: string;
    issueTotalAvgFixTime: string;
    issueHighFixRate: string;
    issueLowFixRate: string;
    issueMediumFixRate: string;
    issueTotalFixRate: string;
  }>;
}
export const getApplicationsTrendData = (params: ParamsType) => {
  return axios.get<SeriesItem[]>(`/applications/${params.id}/metrics`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
};

export const getApplicationsPackageVersions = (params: ComponentsParams) => {
  return axios.get(`/applications/${params.id}/package-versions-statistics`);
};
