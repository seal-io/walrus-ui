import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { SecretRow, SecretFormData } from '../config/interface';

export interface QueryType extends Pagination {
  projectID?: string;
}
export interface ResultType {
  items: SecretRow[];
  pagination: Pagination;
}

export const querySecrets = (params: QueryType) => {
  return axios.get<ResultType>('/secrets', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryItemSecret = (params: { id: string }) => {
  return axios.get(`/secrets/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const createSecret = (data: SecretFormData) => {
  return axios.post('/secrets', data);
};
export const updateSecret = (data: SecretFormData) => {
  return axios.put(`/secrets/${data.id}`, data);
};

export const deleteSecret = (data) => {
  return axios.delete('/secrets', { data });
};
