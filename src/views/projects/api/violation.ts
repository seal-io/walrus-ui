import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';

export interface TableRowData {
  id: string;
  policyID: string;
  eventID: string;
  message: string;
  severity: string;
  action: string;
  fingerprints: string;
  locations: string;
  properties: string;
}

export interface ListParams {
  page: number;
  perPage: number;
  resourceID: string;
  eventID: string;
  strategy?: string;
  compatibilityLevel?: string;
}
interface ListResult {
  items: TableRowData[];
  pagination: Pagination;
}

export function queryViolationsList(params: ListParams) {
  return axios.get<ListResult>(`/violations`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
