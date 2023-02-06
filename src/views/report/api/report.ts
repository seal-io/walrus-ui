import axios, { AxiosRequestConfig } from 'axios';

export interface issuesItem {
  id?: string;
  vulnerability?: any;
  license?: any;
  sast?: any;
  artifact?: object;
  policy?: object;
  resourceId: string;
  severity: string;
  configuration?: any;
  vulnerabilityValue?: number;
  severityValue: number;
  type: string;
  summary: string;
  message: string;
  references: string[];
  dismissInfo: {
    dismissed: boolean;
    dismissedAt: string;
    dismissedExpiry: string;
    dismissedType: string;
    dismissedReason: string;
    dismissedComment: string;
  };
  violationType: string;
}
export interface violationsItem {
  policy: object;
  violations: issuesItem[];
}

export interface eventModel {
  objectLink?: string;
  eventTriggerName?: string;
  repositoryID?: string;
  policyIDs?: string;
  proxyID?: string;
}
export interface IgnoreModel {
  id: string;
  dismissType: string;
  dismissReason: string;
  days: number;
  dismissComment: string;
  dismissExpiry?: string;
}
export interface dataInfoModel {
  event?: eventModel;
  violationSummary?: object;
  eventTriggerName?: string;
  violationBundles?: Array<violationsItem>;
}

interface requestType extends AxiosRequestConfig {
  id: string;
}

export function getEventReport(params) {
  return axios.get<dataInfoModel>(`/reports/${params.id}`, {
    params,
  });
}

export function createViolationIgnore(data: IgnoreModel) {
  return axios.post(`/violations/${data.id}/dismissal`, data);
}
export function resetViolationIgnore(data: requestType) {
  return axios.delete(`/violations/${data.id}/dismissal`, data);
}

export default {
  getEventReport,
};
