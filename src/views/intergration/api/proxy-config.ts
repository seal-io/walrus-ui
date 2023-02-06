import axios from 'axios';
import qs from 'query-string';

export interface FormType {
  id?: string;
  name: string;
  type: string;
  proxyUrl: string;
  upstreamUrl: string;
}
export interface formDataRes {
  id: string | number;
  createTime: string | number;
  updateTime: string | number;
  name: string;
  type: string;
  path: string;
  upstreamUrl: string;
  proxyUrl: string;
}
export function submitFormData(data: FormType) {
  return axios.post('/proxies', { ...data });
}
export function updateFormData(data: FormType) {
  return axios.put(`/proxies/${data.id}`, { ...data });
}
export function getFormData(params) {
  return axios.get<formDataRes>(`/proxies/${params.id}`, {
    params,
  });
}
// delete proxy item
export function deleteProxyItem(data) {
  return axios.delete(`/proxies`, { data });
}
