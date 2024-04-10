import axios from 'axios';
import { ListResult } from '@/types/global';
import qs from 'query-string';

export const TOKEN_API = '/identify/tokens';
export interface FormDataType {
  name: string;
  expirationSeconds: any;
  id?: string;
  accessToken?: string;
  createTime?: string;
}
export interface queryParams {
  page: number;
  perPage?: number;
}

export function queryTokens(params: queryParams) {
  return axios.get<ListResult<FormDataType>>(`${TOKEN_API}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function createTokens(data: FormDataType) {
  return axios.post<FormDataType[]>(`${TOKEN_API}`, data);
}

export function deleteTokens(id) {
  return axios.delete(`${TOKEN_API}/${id}`);
}

export default {};
