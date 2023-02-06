import { def } from '@vue/shared';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';

export interface ResouceItem {
  id: string;
  kind: string;
  provider: string;
  fullName: string;
  namespace: string;
  name: string;
  url: string;
  version: string;
  imported: boolean;
  checked: boolean;
  sourceControlManagerID: string;
  kubernetesID: string;
  repositoryConfiguration: string;
  issueTotalCount: string;
  issueHighCount: string;
  issueMediumCount: string;
  issueLowCount: string;
  lastEvaluationEventID: string;
  lastEvaluationTime: string;
  tags: string;
  evaluationStatus: string;
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
export interface ResouceNameItem extends ResouceItem {
  modelValue: string[];
}
export interface ResouceSpaceItem extends ResouceItem {
  namespace: string;
  modelValue: string[];
  imported: boolean;
  indeterminate: boolean;
  checked: boolean;
  nameList: ResouceItem[];
}
export interface ResouceItemOption extends ResouceItem {
  label: string;
  value: string;
}
interface Result {
  items: ResouceItem[];
}
export function queryKuberneteResource() {
  return axios.get<Result>(`/kubernetes/_/workloads`);
}

interface ParamsType {
  id: string;
  type: string;
  start?: string;
  end?: string;
  timeUnit?: string; // day week month quarter year
}

export const getResourceTrendData = (params: ParamsType) => {
  return axios.get<SeriesItem[]>(`/resources/${params.id}/metrics`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
};
export default {};
