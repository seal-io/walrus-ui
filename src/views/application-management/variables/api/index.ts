import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { VariableRow, VariableFormData } from '../config/interface';

export interface QueryType extends Pagination {
  projectID?: string;
}
export interface ResultType {
  items: VariableRow[];
  pagination: Pagination;
}

export const queryVariables = (params: QueryType) => {
  return axios.get<ResultType>('/variables', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryItemVariable = (params: { id: string }) => {
  return axios.get(`/variables/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const createVariable = ({ data, query }) => {
  return axios.post(`/variables?${qs.stringify(query)}`, data);
};
export const updateVariable = ({ data, query }) => {
  return axios.put(`/variables/${data.id}?${qs.stringify(query)}`, data);
};

export const deleteVariable = ({ data, query }) => {
  return axios.delete(`/variables?${qs.stringify(query)}`, { data });
};
