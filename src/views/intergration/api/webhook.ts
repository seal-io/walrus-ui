import { Pagination } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

interface FormType {
  id?: string;
  webhook: {
    url: string;
  };
}
interface webhookType {
  url: string;
}
interface stmpType {
  host: string;
  port: number | string;
  username: string;
  password?: string;
  senderAddress: string;
  defaultReceiverAddresses: Array<any>;
}
export interface serverItems {
  id: string;
  smtp: stmpType;
  webhook: webhookType;
}
export interface NoticeResType {
  items: Array<serverItems>;
  pagination: Pagination;
}
export interface formDataRes {
  id: string;
  name: string;
  webhook: {
    id?: string;
    url: string;
  };
}
export interface tableListParams {
  page: number;
  perPage: number;
  type: string;
}
export function submitFormData(data: FormType) {
  return axios.post('/notifiers', { ...data });
}

export function testWebhookData(data: FormType) {
  return axios.post('/notifiers/_/test', { ...data });
}

export function updateFormData(data: FormType) {
  return axios.put(`/notifiers/${data.id}`, { ...data });
}
export function getFormData(params) {
  return axios.get<formDataRes>(`/notifiers/${params.id}`, {
    params,
  });
}
// delete notice item
export function deleteNoticeItem(data) {
  return axios.delete(`/notifiers`, { data });
}

export function pushServerList() {
  return axios.get<NoticeResType>(`/notifiers`);
}

export function queryNoticeList(params: tableListParams) {
  return axios.get<NoticeResType>(`/notifiers`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
