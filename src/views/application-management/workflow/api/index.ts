import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { PipelineRow } from '../config/interface';

export const PIPELINE_API = '/workflows';

export const PROJECT_API_PREFIX = () => {
  const { projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}`;
};

export interface QueryType extends Pagination {
  extract?: string[];
  sort?: string[];
}

export interface ResultType {
  items: PipelineRow[];
  pagination: Pagination;
}
export function queryPipelines(params: QueryType, token?) {
  return axios.get<ResultType>(`${PROJECT_API_PREFIX()}${PIPELINE_API}`, {
    params,
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
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

export function queryPipelineDetail(params: { id: string }) {
  return axios.get(`${PROJECT_API_PREFIX()}${PIPELINE_API}/${params.id}`);
}

export function queryPipelineApply(params: { id: string }) {
  return axios.get(`${PROJECT_API_PREFIX()}${PIPELINE_API}/${params.id}/apply`);
}

export default {};
