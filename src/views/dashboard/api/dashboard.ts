import axios from 'axios';
import qs from 'query-string';

interface ParamsType {
  type: string;
  start?: string;
  end?: string;
  timeUnit?: string; // day week month quarter year
}
export const DASHBOARDS_API = '/dashboards';
export interface RevisionParams {
  step: string;
  startTime: string;
  endTime: string;
}
export const getDashBoardOverview = (params) => {
  return axios.get('/dashboards/_/basic-information', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationRevisionsChart = (data: RevisionParams) => {
  return axios.post('/dashboards/_/resource-revision-statistics', data);
};

export const queryLatestDeployments = (params) => {
  return axios.get(`/dashboards/_/latest-resource-revisions`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export function queryCostManagemantData(data: any) {
  return axios.post('/costs/_/cost-reports', data);
}
export default {};
