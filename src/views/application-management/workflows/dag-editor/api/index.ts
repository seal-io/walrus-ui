import axios from 'axios';
import qs from 'query-string';

const namespace = 'walrus-system';

// workflows.argoproj.io/workflow-template=<workflow-template-name>
interface ListOptions {
  labelSelector?: string;
  fieldSelector?: string;
  limit?: number;
  continue?: string;
  fields?: string;
}

const generateListOptions = (options: ListOptions) => {
  const {
    labelSelector,
    fieldSelector,
    limit,
    continue: continueToken,
    fields
  } = options;
  return qs.stringify({
    labelSelector,
    fieldSelector,
    limit,
    continue: continueToken,
    fields
  });
};

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
  return axios.put(`/api/v1/workflows/${namespace}/${data.name}/resubmit`);
};

export const stopWorkflow = (data: { name: string }) => {
  return axios.put(`/api/v1/workflows/${namespace}/${data.name}/stop`);
};

export const deleteWorkflow = (data: { name: string }) => {
  return axios.delete(`/api/v1/workflows/${namespace}/${data.name}`);
};

export const createWorkflow = (data) => {
  return axios.post(`/api/v1/workflows/${namespace}`, data);
};

export const updateWorkflow = (data) => {
  return axios.put(`/api/v1/workflows/${namespace}/resubmit`, data);
};
export const queryWorkflowTemplates = (params) => {
  return axios.get(`/api/v1/workflow-templates/${namespace}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

// watch workflow list
export const watchWorkflowListURL = `/api/v1/workflow-events/${namespace}`;

export default {};
