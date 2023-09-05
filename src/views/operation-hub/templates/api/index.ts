import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { TemplateRowData, TemplateFormData } from '../config/interface';

export const TEMPLATE_API = '/templates';

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}
export const TemplateAPI = '/templates';
export interface ResultType {
  filters: unknown;
  items: TemplateRowData[];
  pagination: Pagination;
}

export interface FormDataPR {
  connectorID: string;
  repository: string;
  branch: string;
  path: string;
  content: string;
}
export function queryTemplates(params: QueryType, token?: any) {
  return axios.get<ResultType>('/templates', {
    params,
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemTemplate(params: { id: string }) {
  return axios.get(`/templates/${params.id}`);
}
export function createTemplate(data: TemplateFormData) {
  return axios.post('/templates', data);
}
export function deleteTemplates(data: { items: { id: string }[] }) {
  return axios.delete('/templates', { data });
}
export function updateTemplate(data: TemplateFormData) {
  return axios.put(`/templates/${data.id}`, data);
}
export function refreshTemplate(data: { id: string }) {
  return axios.post(`/templates/${data.id}/refresh`);
}
export function queryTemplatesVersions(params: { templateID: string }) {
  return axios.get(`/templates/${params.templateID}/versions`);
}

export function queryItemTemplatesVersions(
  params: { templateName: string },
  token?: any
) {
  return axios.get(`/templates/${params.templateName}/versions`, {
    cancelToken: token
  });
}

export function postCompletionsCorrect(data) {
  return axios.post(`/template-completions/_/correct`, data);
}

export function postCompletionsExplain(data) {
  return axios.post(`/template-completions/_/explain`, data);
}
export function postCompletionsGenerate(data) {
  return axios.post(`/template-completions/_/generate`, data);
}
export function postCompletionsPR(data: FormDataPR) {
  return axios.post(`/template-completions/_/create-pr`, data);
}

export function queryCompletionExamples() {
  return axios.get(`/template-completions/_/examples`);
}

export function queryConnectorRepositories(params: { id: string }) {
  return axios.get(`/connectors/${params.id}/repositories`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryConnectorRepositoriesBranch(params: { id: string }) {
  return axios.get(`/connectors/${params.id}/repository-branches`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
