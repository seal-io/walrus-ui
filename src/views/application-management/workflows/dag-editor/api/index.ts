import axios from 'axios';
import qs from 'query-string';

export const queryWorkflows = () => {
  return axios.get('/api/v1/workflows/argo');
};

export const queryWorkflowItem = (data: { name: string }) => {
  return axios.get(`/api/v1/workflows/argo/${data.name}`);
};

export const retryWorkflow = (data: { name: string }) => {
  return axios.put(`/api/v1/workflows/argo/${data.name}/retry`);
};

export const stopWorkflow = (data: { name: string }) => {
  return axios.put(`/api/v1/workflows/argo/${data.name}/stop`);
};

export const deleteWorkflow = (data: { name: string }) => {
  return axios.delete(`/api/v1/workflows/argo/${data.name}`);
};

export default {};
