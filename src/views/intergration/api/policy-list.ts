import { Pagination } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

export interface PolicyTableRow {
  id: string | number;
  name: string;
  proxyUrl: string;
  upstreamUrl: string;
  number: number | string;
  level: number | string;
  status: number;
  checkPolicy: string;
}
export interface PolicyTableRes {
  items: PolicyTableRow[];
  pagination: Pagination;
}

interface ProxyItem {
  id: string;
  name: string;
  type: string;
  upstreamUrl: string;
  proxyUrl: string;
}
interface ProxyResList {
  items: ProxyItem[];
  pagination: Pagination;
}
export interface PolicyTableParams {
  page: number;
  perPage: number;
  type: string;
}
export function queryPolicyDataList(params: PolicyTableParams) {
  return axios.get<PolicyTableRes>(`/proxies`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
export function queryPolicyList() {
  return axios.get<ProxyResList>(`/proxies`);
}
