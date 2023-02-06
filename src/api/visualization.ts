import axios from 'axios';
import { GeneralChart } from '@/types/global';

export interface seriesItem {
  series: Array<[number, number]>;
  tag: { Status: string };
}
export interface GraphsItem {
  name: string;
  series: Array<seriesItem>;
}
export interface DashBoardRes {
  counts: {
    [key: string]: string | number | object;
    toResolveIssueByType: {
      [key: string]: string | number;
    };
  };
  graphs: Array<GraphsItem>;
}
export interface ChartDataRecord {
  x: string;
  y: number;
  name: string;
}
export interface DataChainGrowth {
  quota: string;
}

export interface DataChainGrowthRes {
  count: number;
  growth: number;
  chartData: {
    xAxis: string[];
    data: { name: string; value: number[] };
  };
}
export function queryDataChainGrowth(data: DataChainGrowth) {
  return axios.post<DataChainGrowthRes>('/api/data-chain-growth', data);
}

export interface PopularAuthorRes {
  list: {
    ranking: number;
    author: string;
    contentCount: number;
    clickCount: number;
  }[];
}

export function queryPopularAuthor() {
  return axios.get<PopularAuthorRes>('/api/popular-author/list');
}

export interface ContentPublishRecord {
  x: string[];
  y: number[];
  name: string;
}

export function queryContentPublish() {
  return axios.get<ContentPublishRecord[]>('/api/content-publish');
}

export function queryContentPeriodAnalysis() {
  return axios.post<GeneralChart>('/api/content-period-analysis');
}

export interface PublicOpinionAnalysis {
  quota: string;
}
export interface PublicOpinionAnalysisRes {
  count: number;
  growth: number;
  chartData: ChartDataRecord[];
}
export function queryPublicOpinionAnalysis(data: DataChainGrowth) {
  return axios.post<PublicOpinionAnalysisRes>(
    '/api/public-opinion-analysis',
    data
  );
}

export interface ViewDataRes {
  repository?: number | string;
  proxy?: number | string;
  policy?: number | string;
  toResolveIssue?: number | string;
}
export function queryViewData() {
  return axios.post<ViewDataRes>('/api/view-data');
}
export interface DataOverviewRes {
  xAxis: string[];
  data: Array<{ name: string; value: number[]; count: number }>;
}

export function queryDataOverview() {
  return axios.post<DataOverviewRes>('/api/data-overview');
}

export function queryDashBoradData() {
  return axios.get<DashBoardRes>('/statistics');
}
