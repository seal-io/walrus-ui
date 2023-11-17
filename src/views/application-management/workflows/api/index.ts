import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import _ from 'lodash';
import { PipelineRow, PipelineRecordsRow } from '../config/interface';

export const PIPELINE_API = '/workflows';

export const PIPELINE_EXECUTION_API = '/executions';

export const PROJECT_API_PREFIX = (params?: {
  environmentId?: string;
  projectId?: string;
}) => {
  const { projectId } = params || router.currentRoute.value.params;
  return `/projects/${projectId}`;
};

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
}

export interface ResultType<T> {
  items: T[];
  pagination: Pagination;
}
export function queryPipelines(params: QueryType, token?) {
  return axios.get<ResultType<PipelineRow>>(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}`,
    {
      params: _.omit(params, ['id']),
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
}

export function createPipeline(data: PipelineRow) {
  return axios.post(`${PROJECT_API_PREFIX()}${PIPELINE_API}`, data);
}

export function deletePipelineExecution(params: {
  id: string;
  flowId: string;
}) {
  return axios.delete(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      params.flowId
    }${PIPELINE_EXECUTION_API}/${params.id}`
  );
}

export function deletePipeline(data: { items: { id: string }[] }) {
  return axios.delete(`${PROJECT_API_PREFIX()}${PIPELINE_API}`, { data });
}

export function updatePipeline(data: PipelineRow) {
  return axios.put(`${PROJECT_API_PREFIX()}${PIPELINE_API}/${data.id}`, data);
}

export function queryPipelineDetail(params: { id: string }, token?) {
  return axios.get<PipelineRow>(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${params.id}`,
    {
      cancelToken: token
    }
  );
}

export function applyPipeline(data: { id: string; projectId: string }) {
  return axios.post(
    `${PROJECT_API_PREFIX(data)}${PIPELINE_API}/${data.id}/run`,
    data
  );
}

export function retryApplyPipeline(data: { flowId: string; execId: string }) {
  return axios.put(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      data.flowId
    }${PIPELINE_EXECUTION_API}/${data.execId}/rerun`
  );
}
export function stopApplyPipeline(data: { flowId: string; execId: string }) {
  return axios.put(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      data.flowId
    }${PIPELINE_EXECUTION_API}/${data.execId}/stop`
  );
}

export const queryPipelineRecords = (params: { id: string }, token?) => {
  return axios.get<ResultType<PipelineRecordsRow>>(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      params.id
    }${PIPELINE_EXECUTION_API}`,
    {
      params: _.omit(params, ['id']),
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryPipelineRecordDetail = (
  params: { execId: string; flowId: string },
  token?
) => {
  return axios.get(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${
      params.flowId
    }${PIPELINE_EXECUTION_API}/${params.execId}`,
    {
      cancelToken: token
    }
  );
};

export const queryPipelineLatestRecordDetail = (
  params: { flowId: string },
  token?
) => {
  return axios.get(
    `${PROJECT_API_PREFIX()}${PIPELINE_API}/${params.flowId}/latest-execution`,
    {
      cancelToken: token
    }
  );
};
export const getPipelineTaskLogUrl = ({
  projectId,
  flowId,
  flowExecId,
  stageExecId,
  stepExecId
}) => {
  return `/projects/${projectId}/workflows/${flowId}/executions/${flowExecId}/stage-executions/${stageExecId}/step-executions/${stepExecId}/log`;
};

export const getPipelineTaskDetail = ({
  projectId,
  flowId,
  flowExecId,
  stageExecId,
  stepExecId
}) => {
  const url = `/projects/${projectId}/workflows/${flowId}/executions/${flowExecId}/stage-executions/${stageExecId}/step-executions/${stepExecId}`;
  return axios.get(url);
};

export const approvePipelineTask = (
  { projectId, flowId, flowExecId, stageExecId, stepExecId },
  data
) => {
  const url = `/projects/${projectId}/workflows/${flowId}/executions/${flowExecId}/stage-executions/${stageExecId}/step-executions/${stepExecId}/approve`;
  return axios.post(url, data);
};

export default {};
