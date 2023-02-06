import axios from 'axios';
import qs from 'query-string';

interface FormType {
  id?: string;
  host: string;
  name: string;
  port: number | string;
  username: string;
  password: string;
  senderAddress: string;
  tls: boolean;
  defaultRecipientAddresses: Array<any>;
}

export interface formDataRes {
  id: string;
  name: string;
  smtp: {
    id?: string;
    host: string;
    port: number | string;
    username: string;
    password: string;
    tls: boolean;
    senderAddress: string;
    defaultRecipientAddresses: Array<any>;
  };
}
export function submitFormData(data: FormType) {
  const params = {
    name: data.name || '',
    smtp: {
      ...data,
    },
  };
  return axios.post('/notifiers', { ...params });
}
export function testEmailAccount(data: FormType) {
  const params = {
    name: data.name || '',
    smtp: {
      ...data,
    },
  };
  return axios.post('/notifiers/_/test', { ...params });
}
export function updateFormData(data: FormType) {
  const params = {
    id: data.id || '',
    name: data.name || '',
    smtp: {
      ...data,
    },
  };
  return axios.put(`/notifiers/${data.id}`, { ...params });
}
export function getFormData(params) {
  return axios.get<formDataRes>(`/notifiers/${params.id}`, {
    params,
  });
}
// delete proxy item
export function deleteProxyItem(params) {
  return axios.delete(`/notifiers/${params.id}`);
}
