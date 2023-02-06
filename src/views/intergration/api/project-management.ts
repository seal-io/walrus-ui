import { Pagination } from '@/types/global';
import axios from 'axios';

export interface FormType {
  accessToken?: string;
  type?: string;
  apiBaseURL?: string;
  isPrivate: boolean;
  provider: string;
  clientID: string;
  clientSecret: string;
  resourceID: string;
  resourceURL: string;
  redirectURL: string;
  url: string;
  code: string;
  id?: string;
  codeVerifier?: string;
  enable?: boolean;
}
export interface FormAuthType {
  provider: string;
  clientID: string;
  clientSecret: string;
  url?: string;
  redirectURL: string;
  code?: string;
  id?: string;
  enable?: boolean;
}
export interface JiraItem {
  id?: string;
  clientID: string;
  clientSecret: string;
  url: string;
  apiBaseURL: string;
  accessToken: string;
  refreshToken: string;
  provider: string;
}
interface tableListRes {
  items: JiraItem[];
  pagination: Pagination;
}
interface userListRes {
  displayName: string;
  active: boolean;
  accountType: string;
  accountId: string;
  id?: string;
  value?: string;
  name?: string;
  timeZone: string;
}
export const getJiraAuthUrl = (data: FormAuthType) => {
  return axios.post('/tracking-systems/_/auth-url', data);
};

export const submitFormData = (data: FormType) => {
  return axios.post('/tracking-systems', data);
};
export const getProjectManageMents = () => {
  return axios.get<tableListRes>('/tracking-systems');
};
export const queryUserList = (params: { id: string }) => {
  return axios.get<userListRes[]>(`/tracking-systems/${params.id}/users`);
};
export const updateFormData = (data: FormType) => {
  return axios.put(`/tracking-systems/${data.id}`, data);
};
export const getFormData = (params: { id: string | number }) => {
  return axios.get(`/tracking-systems/${params.id}`);
};
export const queryAccessResource = (params: { id: string }) => {
  return axios.get(`/tracking-systems/${params.id}/access-resources`);
};
export const submitResourceUrl = (data: {
  id: string;
  resourceID: string;
  resourceURL: string;
}) => {
  return axios.put(`/tracking-systems/${data.id}/access-resources`, data);
};
