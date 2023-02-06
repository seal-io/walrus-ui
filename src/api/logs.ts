import { Pagination } from '@/types/global';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';

interface RiskLevel {
  high: number | string;
  middle: number | string;
  low: number | string;
}
export interface LogsTableRow {
  id: string | number;
  time: number | string;
  events: string;
  source: string;
  objectStr: string;
  status: string;
  highRisk: number;
  middleRisk: number;
  lowRisk: number;
  risk: RiskLevel;
  objectName: string;
  objectLink: string;
  type: string;
}
export interface LogsTableRes {
  filters: unknown;
  items: LogsTableRow[];
  pagination: Pagination;
}
export interface LogsTableParams {
  page: number;
  perPage: number;
  objectName_like?: string;
  status?: string;
  type?: string;
}
export function queryLogsDataList(params: LogsTableParams) {
  return axios.get<LogsTableRes>('/events', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

interface requestType extends AxiosRequestConfig {
  id: string | Array<string>;
}

export function getLogReport(params: requestType) {
  return axios.get(`/events/${params.id}`, params);
}

export function deleteLogsById(data: any) {
  return axios.delete(`/events`, { data });
}
