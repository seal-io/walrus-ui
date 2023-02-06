import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';

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
  fullName: string;
  name: string;
  namespace: string;
  private: boolean;
  url: string;
  description: string;
  objectStr: string;
  status: number;
  highRisk: number;
  middleRisk: number;
  disabled?: boolean;
  imported?: boolean;
  lowRisk: number;
  risk: RiskLevel;
}
export type LogsTableRes = {
  items: LogsTableRow[];
  pagination: Pagination;
};
export interface LogsTableParams extends Partial<LogsTableRow> {
  page: number;
  perPage: number;
  id: any;
}
export function queryLogsDataList(params: LogsTableParams) {
  return axios.get<LogsTableRes>(
    `/source-control-managers/${params.id}/repositories`,
    {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      },
    }
  );
}

export function postImportRepos(data: any) {
  return axios.post('/resources/_/batch', data);
}

export function deleteRepos(data: any) {
  return axios.delete(`/resources`, { data });
}
