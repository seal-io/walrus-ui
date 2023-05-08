import axios from 'axios';
import qs from 'query-string';

interface ParamsType {
  type: string;
  start?: string;
  end?: string;
  timeUnit?: string; // day week month quarter year
}
export interface RevisionParams {
  step: string;
  startTime: string;
  endTime: string;
}
export const getDashBoardOverview = () => {
  return axios.get('/dashboards/_/basic-information');
};

export const queryApplicationRevisionsChart = (data: RevisionParams) => {
  return axios.post('/dashboards/_/application-revision-statistics', data);
};

export function queryCostManagemantData(data: any) {
  return axios.post('/costs/_/allocation-costs', data);
}
export default {};
