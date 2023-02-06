import { Pagination } from '@/types/global';
import axios from 'axios';

export interface FormType {
  id?: string;
  excludeType?: string;
  namespaceStr?: string;
  name: string;
  kubeConfig: string;
  excludedNamespaces: string[];
}

export interface kuberItem {
  id: string;
  name: string;
  kubeConfig: string;
  excludedNamespaces: string[];
}
interface tableListRes {
  items: kuberItem[];
  pagination: Pagination;
}

export const submitFormData = (data: FormType) => {
  return axios.post('/kubernetes', data);
};
export const queryKubernetesList = () => {
  return axios.get<tableListRes>('/kubernetes');
};
export function deleteProxyItem(data) {
  return axios.delete(`/kubernetes`, { data });
}
export const updateFormData = (data: FormType) => {
  return axios.put(`/kubernetes/${data.id}`, data);
};
export const getFormData = (params: { id: string | number }) => {
  return axios.get(`/kubernetes/${params.id}`);
};
