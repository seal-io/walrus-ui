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
  return axios.get<ResultType>('/variables', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryItemSecret = (params: { id: string }) => {
  return axios.get(`/variables/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const createSecret = ({ data, query }) => {
  return axios.post(`/variables?${qs.stringify(query)}`, data);
};
export const updateSecret = ({ data, query }) => {
  return axios.put(`/variables/${data.id}?${qs.stringify(query)}`, data);
};

export const deleteSecret = ({ data, query }) => {
  return axios.delete(`/variables?${qs.stringify(query)}`, { data });
};
