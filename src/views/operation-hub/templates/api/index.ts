import axios from 'axios';
import _, { pick } from 'lodash';
import qs from 'query-string';
import { Pagination, ListQuery } from '@/types/global';
import router from '@/router';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import { TemplateRowData, TemplateFormData } from '../config/interface';

export const TEMPLATE_API = 'templates';

export const SCHEMA_API = 'schemas';

export { GlobalNamespace, NAMESPACES };

export const PROJECT_API_PREFIX = () => {
  return `/projects/${router.currentRoute.value.params.projectId}`;
};

export const isProjectContext = () => {
  return !!router.currentRoute.value.params.projectId;
};

export interface QueryType extends ListQuery {
  extract?: string[];
  sort?: string[];
  _group?: string[];
}

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
export function queryTemplates(params: ListQuery, token?: any) {
  const url = `/${NAMESPACES}/${params.namespace}/${TEMPLATE_API}`;

  return axios.get<ResultType>(url, {
    params: _.omit(params, ['namespace']),
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryItemTemplate(params: { name: string; namespace: string }) {
  const url = `/${NAMESPACES}/${params.namespace}/${TEMPLATE_API}/${params.name}`;

  return axios.get(url);
}
export function createTemplate(data: TemplateFormData) {
  const url = `/${NAMESPACES}/${data.metadata.namespace}/${TEMPLATE_API}`;

  return axios.post(url, data);
}
export function deleteTemplates(data: ListQuery) {
  const url = `/${NAMESPACES}/${data.namespace}/${TEMPLATE_API}/${data.name}`;

  return axios.delete(url, { data });
}
export function updateTemplate(data: TemplateFormData) {
  const url = `/${NAMESPACES}/${data.metadata.namespace}/${TEMPLATE_API}/${data.metadata.name}`;

  return axios.put(url, data);
}

export function refreshTemplate(data: {
  name: string;
  namespace: string;
  item: object;
}) {
  const url = `/${NAMESPACES}/${data.namespace}/${TEMPLATE_API}/${data.name}`;
  return axios.put(`${url}`, data.item);
}

export function queryTemplatesVersions(params: { templateID: string }) {
  let url = `${TEMPLATE_API}/${params.templateID}/versions`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${TEMPLATE_API}/${
      params.templateID
    }/versions`;
  }
  return axios.get(url, {
    params: {
      ...pick(params, ['extract', 'query', 'page'])
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryTemplatesVersionSchema(params: { templateID: string }) {
  let url = `${TEMPLATE_API}/${params.templateID}/versions`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${TEMPLATE_API}/${
      params.templateID
    }/versions`;
  }
  return axios.get(url);
}

export function queryTemplateSchemaByVersionId(
  params: { name: string; namespace: string },
  token?: any
) {
  const url = `/${NAMESPACES}/${params.namespace}/${SCHEMA_API}/${params.name}`;
  return axios.get(url, {
    cancelToken: token
  });
}

export function putTemplateSchemaByVersionId(params: {
  templateVersionID: string;
  data;
}) {
  let url = `/template-versions/${params.templateVersionID}`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${url}`;
  }
  return axios.put(url, params.data);
}

export function resetTemplateSchemaByVersionId(params: {
  templateVersionID: string;
}) {
  let url = `/template-versions/${params.templateVersionID}/reset`;
  if (isProjectContext()) {
    url = `${PROJECT_API_PREFIX()}${url}`;
  }
  return axios.post(url);
}

export function queryItemTemplatesVersions(
  params: { templateID: string; isProjectTemplate?: boolean },
  token?: any
) {
  let url = `${TEMPLATE_API}/${params.templateID}/versions`;
  if (params.isProjectTemplate) {
    url = `${PROJECT_API_PREFIX()}${TEMPLATE_API}/${
      params.templateID
    }/versions`;
  }
  return axios.get(url, {
    params: {
      ...pick(params, ['extract', 'query'])
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
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
