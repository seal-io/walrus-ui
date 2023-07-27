import axios from 'axios';
import { ListResult } from '@/types/global';
import qs from 'query-string';

export const TOKEN_API = '/tokens';
export interface FormDataType {
  name: string;
  expiration: any;
  id?: string;
  accessToken?: string;
  createTime?: string;
}
export interface queryParams {
  page: number;
  perPage?: number;
}

export function queryTokens(params: queryParams) {
  return axios.get<ListResult<FormDataType>>('/tokens', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function createTokens(data: FormDataType) {
  return axios.post<FormDataType[]>('/tokens', data);
}

export function deleteTokens(id) {
  return axios.delete(`/tokens/${id}`);
}

export default {};
