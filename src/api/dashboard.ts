import axios from 'axios';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: string;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<PopularRecord[]>('/api/popular/list', { params });
}
