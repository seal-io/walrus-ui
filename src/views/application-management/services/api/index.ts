import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { DeletePayload } from '@/views/config/interface';
import { ServiceRowData, EndPointRow } from '../config/interface';

export const SERVICE_API = '/resources';

export const SERVICE_API_PREFIX = (params?: {
  environmentId: string;
  projectId: string;
}) => {
  const { environmentId, projectId } =
    params || router.currentRoute.value.params;
  return `/projects/${projectId}/environments/${environmentId}`;
};

export const SERVICE_RESOURCE_API_PREFIX = () => {
  const { environmentId, projectId } = router.currentRoute.value.params;
  const { id } = router.currentRoute.value.query;
  return `/projects/${projectId}/environments/${environmentId}${SERVICE_API}/${id}`;
};

// some params for permission
export const getPermissionRouteParams = () => {
  const { params } = router.currentRoute.value;
  return { projectID: params?.projectId };
};

// interface ParamsType extends Pagination {}
export interface ResultType {
  items: ServiceRowData[];
  pagination: Pagination;
}
export interface QueryType extends Pagination {
  projectID?: string;
}

// workflow create service step
interface ServiceParams extends Pagination {
  flow?: {
    projectId: string;
    environmentId: string;
  };
}
export const queryServices = (params: ServiceParams, token?) => {
  return axios.get<ResultType>(
    `${SERVICE_API_PREFIX(params.flow)}${SERVICE_API}`,
    {
      params: {
        ..._.omit(params, ['flow'])
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      },
      cancelToken: token
    }
  );
};

export const createService = (data) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}`, data);
};

export const createResourceBatch = (data) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/_/batch`, data);
};

// environmentID is the tartget environment, projectID is the target project
export const cloneServices = (data: {
  projectID: string;
  environmentID: string;
  draft: boolean;
  items: Record<string, any>[];
}) => {
  return axios.post(
    `/projects/${data.projectID}/environments/${data.environmentID}${SERVICE_API}/_/batch`,
    { items: data.items, draft: data.draft }
  );
};

export const deleteServices = (data: {
  data: { items: Array<{ id: string }> };
  withoutCleanup: boolean;
  projectID?: string;
  environmentID?: string;
  withParams?: boolean;
}) => {
  if (data.withParams) {
    return axios.delete(
      `/projects/${data.projectID}/environments/${
        data.environmentID
      }${SERVICE_API}?${qs.stringify({
        withoutCleanup: data.withoutCleanup
      })}`,
      {
        data: data.data
      }
    );
  }
  return axios.delete(
    `${SERVICE_API_PREFIX()}${SERVICE_API}?${qs.stringify({
      withoutCleanup: data.withoutCleanup
    })}`,
    {
      data: data.data
    }
  );
};
export const deployApplication = (data) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}`, data);
};

export const updateService = (data) => {
  return axios.put(`${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}`, data);
};

export const queryItemService = (params) => {
  return axios.get(`${SERVICE_API_PREFIX()}${SERVICE_API}/${params.id}`);
};

export const queryItemServiceDetail = (params: {
  projectID: string;
  environmentID: string;
  serviceID: string;
}) => {
  return axios.get(
    `/projects/${params.projectID}/environments/${params.environmentID}${SERVICE_API}/${params.serviceID}`
  );
};

// ========service======
export const queryApplicationServices = (params) => {
  return axios.get(`${SERVICE_API_PREFIX()}${SERVICE_API}`, {
    params: {
      ...params
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryInstanceOutputs = (params) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.id}/outputs`
  );
};
export const deleteServiceItem = (data) => {
  return axios.delete(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}?${qs.stringify({
      withoutCleanup: data.withoutCleanup
    })}`
  );
};

export const upgradeApplicationInstance = (data) => {
  return axios.put(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/upgrade`,
    data
  );
};
export const redeployService = (data) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/deploy`);
};

export const deployItemService = (data: {
  items: { id: string }[];
  reuseAttributes: boolean;
  projectID: string;
  environmentID: string;
  changeComment?: string;
  serviceID: string;
}) => {
  return axios.post(
    `/projects/${data.projectID}/environments/${data.environmentID}${SERVICE_API}/_/upgrade`,
    {
      items: data.items,
      reuseAttributes: data.reuseAttributes,
      changeComment: data.changeComment
    }
  );
};

export const batchDeployService = (data: {
  items: { id: string }[];
  reuseAttributes: boolean;
  changeComment: string;
}) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/_/upgrade`, data);
};

export const batchStopService = (data: { items: { id: string }[] }) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/_/stop`, data);
};

export const batchStartService = (data: { items: { id: string }[] }) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/_/start`, data);
};

export const stopApplicationInstance = (data, withParams?: boolean) => {
  if (withParams) {
    return axios.post(
      `/projects/${data.projectID}/environments/${data.environmentID}${SERVICE_API}/${data.serviceID}/stop`
    );
  }
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/stop`);
};

export const startApplicationInstance = (data, withParams?: boolean) => {
  if (withParams) {
    return axios.post(
      `/projects/${data.projectID}/environments/${data.environmentID}${SERVICE_API}/${data.serviceID}/start`
    );
  }
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/start`);
};

export const cloneApplicationInstance = (data: {
  id: string;
  name: string;
}) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/clone`,
    data
  );
};

export const diffServiceSpec = (params: { serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/diff-latest`,
    {
      params: {
        ...params
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceResourceGraph = (params: { serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/graph`
  );
};

export const queryEnvironmentServiceGraph = () => {
  return axios.get(`${SERVICE_API_PREFIX()}/graph`);
};

export const refreshServiceConfig = (params: { serviceID: string }) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/refresh`
  );
};
// =========history================
interface ServiceRevisionParams extends Pagination {
  serviceID?: string;
  sort?: string[];
}

export const queryServiceRevisions = (
  params: ServiceRevisionParams & { _action?: string },
  token?
) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/runs`,
    {
      params: {
        ..._.omit(params, ['serviceID', '_action'])
      },
      headers: {
        _action: params._action || ''
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceRevisionsDetail = (params: {
  id: string;
  serviceID: string;
}) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/runs/${
      params.id
    }`
  );
};

export const deleteApplicationRevisions = (data: DeletePayload) => {
  return axios.delete(`${SERVICE_RESOURCE_API_PREFIX()}/runs`, {
    data
  });
};

export const diffRevisionSpec = (params: { id: string; serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/runs/${
      params.id
    }/diff-latest`
  );
};

export const queryRevisionChange = (params: {
  id: string;
  serviceID: string;
}) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/runs/${
      params.id
    }/diff-previous`
  );
};

export const applyResourceRun = (params: {
  serviceID: string;
  id: string;
  data: any;
}) => {
  return axios.put(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/runs/${
      params.id
    }/apply`,
    params.data
  );
};

export const rollbackService = (data: {
  revisionID: string;
  serviceID: string;
  changeComment: string;
}) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      data.serviceID
    }/rollback?${qs.stringify({
      revisionID: data.revisionID
    })}`,
    { changeComment: data.changeComment }
  );
};

// ===========resource==========
export const queryServiceResource = (params: ServiceRevisionParams, token?) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/components`,
    {
      params: {
        ..._.omit(params, ['serviceID'])
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceResourceKeys = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/components/${params.id}/keys`,
    {
      params: {
        ...params
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceResourceLogs = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/components/${params.id}/log`,
    {
      params: {
        ...params
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
export const queryServiceResourceExec = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/components/${params.id}/exec`,
    {
      params: {
        ...params
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
type EndPointResult = EndPointRow[];
export const queryInstanceEndpoints = (
  params: { serviceID: string },
  token
) => {
  return axios.get<EndPointResult>(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/endpoints`,
    {
      params: {
        ..._.omit(params, ['serviceID'])
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
