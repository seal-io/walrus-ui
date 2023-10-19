import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import _ from 'lodash';
import { PipelineRow, PipelineRecordsRow } from '../config/interface';

export const PIPELINE_API = '/workflows';

export const PIPELINE_EXECUTION_API = '/executions';

export const PROJECT_API_PREFIX = () => {
  const { projectId } = router.currentRoute.value.params;
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

export function deletePipeline(data: { items: Record<string, any>[] }) {
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

export function applyPipeline(data: { id: string }) {
  return axios.post(`${PROJECT_API_PREFIX()}${PIPELINE_API}/${data.id}/apply`);
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

export const getPipelineTaskLog = ({
  projectId,
  flowId,
  flowExecId,
  stageExecId,
  stepExecId
}) => {
  return `/projects/${projectId}/workflows/${flowId}/executions/${flowExecId}/stage-executions/${stageExecId}/step-executions/${stepExecId}/log`;
};

export default {};
