import axios from 'axios';
import qs from 'query-string';

interface ParamsType {
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

export interface PackageItem {
  name: string;
  language: string;
  resourcesNum: number;
  version: string;
  vulnerabilitySummary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  releaseDate: string;
}
interface PackageVersionItem {
  name: string;
  versionNum: number;
  language: string;
}
interface PackagesResult {
  packageUse: PackageItem[];
  packageVersion: PackageVersionItem[];
}
interface LicenseResult {
  rank: Array<{ name: string; packageCount: number }>;
  distribution: Array<{ name: string; packageCount: number }>;
}
export interface Result {
  kind: string;
  name: string;
  series: SeriesItem[];
}
export interface RevisionParams {
  step: string;
  startTime: string;
  endTime: string;
}
export const getDashBoardOverview = () => {
  return axios.get('/dashboards/_/basic-infos');
};

export const queryApplicationRevisionsChart = (data: RevisionParams) => {
  return axios.post('/dashboards/_/application-revision-statistics', data);
};
export const getDashBoardIssueTrend = (params: ParamsType) => {
  return axios.get<SeriesItem[]>('/statistics/_/metrics', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const getDashboardPackages = () => {
  return axios.get<PackagesResult>('/statistics/_/packages');
};
export const getDashboardLicenses = () => {
  return axios.get<LicenseResult>('/statistics/_/licenses');
};

export function queryCostManagemantData(data: any) {
  return axios.post('/costs/_/allocation-costs', data);
}
export default {};
