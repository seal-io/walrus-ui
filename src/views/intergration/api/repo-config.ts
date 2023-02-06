import { Pagination } from '@/types/global';
import axios from 'axios';

export interface FormType {
  clientId: string;
  clientSecret: string;
  code: string;
  provider: string;
  enable: boolean;
  id?: string;
  managePrivateRepos: boolean;
  enablePullRequestCommenting: boolean;
  enableScheduleEvaluation: boolean;
}
interface RepoItem {
  id: string;
  url: string;
  webhookSecret: string;
  managePrivateRepos: boolean;
  provider: string;
  type?: string;
  enablePullRequestCommenting: boolean;
  enableScheduleEvaluation: boolean;
}
interface SourceRepoList {
  items: RepoItem[];
  pagination: Pagination;
}
export interface SubmitRes extends FormType {
  id: string;
}
export function submitFormData(data: FormType) {
  return axios.post<SubmitRes>('/source-control-managers', { ...data });
}

export function getSoureceRepoList() {
  return axios.get<SourceRepoList>('/source-control-managers');
}
export function getFormData(params: { id: string | number }) {
  return axios.get(`/source-control-managers/${params.id}`, { params });
}
export function updateFormData(data: FormType) {
  return axios.put(`/source-control-managers/${data.id}`, { ...data });
}
export function deleteRepoConfig(params: { id: string | number }) {
  return axios.delete(`/source-control-managers/${params.id}`, { params });
}
export function getScourceRepository(params: { id: string | number }) {
  return axios.get(`/source-control-managers/${params.id}/repositories`, {
    params,
  });
}
