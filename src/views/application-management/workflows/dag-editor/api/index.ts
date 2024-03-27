import axios from 'axios';
import qs from 'query-string';

const namespace = 'walrus-system';

export const queryWorkflows = (params) => {
  return axios.get(`/api/v1/workflows/${namespace}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryWorkflowItem = (data: { name: string }) => {
  return axios.get(`/api/v1/workflows/${namespace}/${data.name}`);
};

export const retryWorkflow = (data: { name: string }) => {
  return axios.put(`/api/v1/workflows/${namespace}/${data.name}/retry`);
};

export const stopWorkflow = (data: { name: string }) => {
  return axios.put(`/api/v1/workflows/${namespace}/${data.name}/stop`);
};

export const deleteWorkflow = (data: { name: string }) => {
  return axios.delete(`/api/v1/workflows/${namespace}/${data.name}`);
};

export default {};
