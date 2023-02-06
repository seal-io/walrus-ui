import { Pagination } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

interface RiskLevel {
  critical: number | string;
  high: number | string;
  middle: number | string;
  low: number | string;
}
export interface tableListRow {
  id: string;
  time: number | string;
  fullName?: string;
  provider?: string;
  events: string;
  source: string;
  project: string;
  status: number;
  namespace: string;
  loading?: boolean;
  url: string;
  critical: number;
  highRisk: number;
  middleRisk: number;
  isParent?: boolean;
  childName?: string;
  isLeaf?: boolean;
  lowRisk: number;
  kind: string;
  risk: RiskLevel;
  children?: tableListRow[];
  isChildren?: boolean;
  parentId?: string;
  edges: {
    children: tableListRow[];
  };
  versionSelector: Array<{
    value: string;
    tags: string[];
    limit: number | undefined;
    operator: string;
  }>;
  lastEvaluationEventID: string;
  lastEvaluationTime: string;
  readonly?: boolean;
  evaluationStatus: string;
}
export interface tableListRes {
  filters: unknown;
  items: tableListRow[];
  pagination: Pagination;
}
// type fieldType = string | number | boolean | string[];
type fieldType = any;
type fieldObjType = {
  [key: string]: fieldType;
};
export interface RepoTicket {
  id: string;
  resourceID: string;
  severity?: string[];
  violationID?: string;
  fields: {
    project: {
      id: string;
    };
    assignee: {
      accountId: string;
    };
    issuetype: {
      id: string;
    };
    [key: string]: fieldType | fieldObjType;
  };
}
export interface TableQueryParams {
  page: number;
  perPage: number;
  all?: boolean;
}
export function queryDataList(params: TableQueryParams) {
  return axios.get<tableListRes>('/resources', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function queryResourceItem(params: { id: string }) {
  return axios.get<tableListRow>(`/resources/${params.id}`);
}

export function queryJiraDataList(params: { id: string }) {
  return axios.get(`/tracking-systems/${params.id}/projects`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function submitFormData(data) {
  return axios.post(`/resources`, data);
}
export function updateFormData(data) {
  return axios.put(`/resources/${data.id}`, data);
}
export function submitResourceScanSettings(data) {
  return axios.post(`/resources/${data.id}`, data);
}
export function scanProject(id) {
  return axios.post(`/resources/${id}/evaluate`);
}
export function setResourceTags(params: {
  id: string;
  tags: { tags: string[] };
}) {
  return axios.put(`/resources/${params.id}/tags`, params.tags);
}
export function submitRepoTicket(data: RepoTicket) {
  return axios.post(`/tracking-systems/${data.id}/reports`, data);
}
export function submitViolationTicket(data: RepoTicket) {
  return axios.post(`/tracking-systems/${data.id}/reports`, data);
}
export function queryJiraIssueType(params: { id: string; projectID: string }) {
  return axios.get(`/tracking-systems/${params.id}/projects`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
