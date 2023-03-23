import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { TemplateRowData, TemplateFormData } from '../config/interface';

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}

export interface ResultType {
  filters: unknown;
  items: TemplateRowData[];
  pagination: Pagination;
}
export function queryModules(params: QueryType) {
  return axios.get<ResultType>('/modules', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemModules(params: { id: string }) {
  return axios.get(`/modules/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function createModules(data: TemplateFormData) {
  return axios.post('/modules', data);
}
export function deleteModules(data) {
  return axios.delete('/modules', { data });
}
export function updateModules(data: TemplateFormData) {
  return axios.put(`/modules/${data.id}`, data);
}
export function refreshModules(data: { id: string }) {
  return axios.post(`/modules/${data.id}/refresh`);
}
export function queryModulesVersions(params: { moduleID: string }) {
  return axios.get(`/module-versions`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryModulesAllVersions(params: { moduleID: string[] }) {
  return axios.get(`/module-versions`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function postCompletionsCorrect(data) {
  return axios.post(`/module-completions/_/correct`, data);
}

export function postCompletionsExplain(data) {
  return axios.post(`/module-completions/_/explain`, data);
}
export function postCompletionsGenerate(data) {
  return axios.post(`/module-completions/_/generate`, data);
}

export function queryCompletionExamples() {
  return axios.get(`/module-completions/_/examples`);
}
