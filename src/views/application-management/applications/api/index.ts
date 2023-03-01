import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { AppRowData } from '../config/interface';

export const queryApplications = (params) => {
  return axios.get('/applications', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createApplication = (data) => {
  return axios.post(`/applications`, data);
};

export const updateApplication = (data) => {
  return axios.put(`/applications/${data.id}`, data);
};

export const queryItemApplication = (params) => {
  return axios.get(`/applications/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
