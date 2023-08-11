import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { ServiceRowData, EndPointRow } from '../config/interface';

export const SERVICE_API = '/services';

export const SERVICE_API_PREFIX = () => {
  const { environmentId, projectId } = router.currentRoute.value.params;
  return `/projects/${projectId}/environments/${environmentId}`;
};

export const SERVICE_RESOURCE_API_PREFIX = () => {
  const { environmentId, projectId } = router.currentRoute.value.params;
  const { id } = router.currentRoute.value.query;
  return `/projects/${projectId}/environments/${environmentId}/services/${id}`;
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
export const queryServices = (params: QueryType, token?) => {
  return axios.get<ResultType>(`${SERVICE_API_PREFIX()}${SERVICE_API}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
    cancelToken: token
  });
};

export const createService = (data) => {
  return axios.post(`${SERVICE_API_PREFIX()}${SERVICE_API}`, data);
};
export const cloneServices = (data: {
  projectID: string;
  formData: object;
}) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/_/batch?${qs.stringify({
      projectID: data.projectID
    })}`,
    data.formData
  );
};
export const deleteServices = ({ data, withoutCleanup }) => {
  return axios.delete(
    `${SERVICE_API_PREFIX()}${SERVICE_API}?${qs.stringify({
      withoutCleanup
    })}`,
    {
      data
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
  return axios.get(`${SERVICE_API_PREFIX()}${SERVICE_API}/${params.id}`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
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
export const queryItemApplicationService = (params) => {
  return axios.get(`${SERVICE_API_PREFIX()}${SERVICE_API}/${params.id}`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryInstanceOutputs = (params) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.id}/outputs`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
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
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/upgrade?${qs.stringify(
      getPermissionRouteParams()
    )}`,
    data
  );
};

export const cloneApplicationInstance = (data: {
  id: string;
  name: string;
}) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${data.id}/clone?${qs.stringify(
      getPermissionRouteParams()
    )}`,
    data
  );
};

export const diffServiceSpec = (params: { serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/diff-latest`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceResourceGraph = (params: { serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/graph`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryEnvironmentServiceGraph = (params: {
  environmentID: string;
}) => {
  return axios.get(`${SERVICE_API_PREFIX()}/graph`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const refreshServiceConfig = (params: { serviceID: string }) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${params.serviceID}/refresh`
  );
};
// =========history================
interface ApplicationRevisionParams extends Pagination {
  serviceID?: string;
  sort?: string[];
}

export const queryApplicationRevisions = (
  params: ApplicationRevisionParams,
  token?
) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      params.serviceID
    }/service-revisions`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
export const queryApplicationRevisionsDetail = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/service-revisions/${params.id}`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const deleteApplicationRevisions = (data: { id: string }[]) => {
  return axios.delete(`${SERVICE_RESOURCE_API_PREFIX()}/service-revisions`, {
    data
  });
};

export const diffRevisionSpec = (params: { id: string; serviceID: string }) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      params.serviceID
    }/service-revisions/${params.id}/diff-latest`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
export const queryRevisionChange = (params: {
  id: string;
  serviceID: string;
}) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      params.serviceID
    }/service-revisions/${params.id}/diff-previous`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const rollbackInstance = (data: {
  revisionID: string;
  serviceID: string;
}) => {
  return axios.post(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      data.serviceID
    }/rollback?${qs.stringify({
      ...getPermissionRouteParams(),
      revisionID: data.revisionID
    })}`
  );
};

export const rollbackApplication = (data: { id: string }) => {
  return axios.post(
    `${SERVICE_RESOURCE_API_PREFIX()}/service-revisions/${
      data.id
    }/rollback-applications?${qs.stringify(getPermissionRouteParams())}`
  );
};
// ===========resource==========
export const queryServiceResource = (
  params: ApplicationRevisionParams,
  token?
) => {
  return axios.get(
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      params.serviceID
    }/service-resources`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
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
    `${SERVICE_RESOURCE_API_PREFIX()}/service-resources/${params.id}/keys`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryServiceResourceLogs = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/service-resources/${params.id}/log`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
export const queryServiceResourceExec = (params: { id: string }) => {
  return axios.get(
    `${SERVICE_RESOURCE_API_PREFIX()}/service-resources/${params.id}/exec`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
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
    `${SERVICE_API_PREFIX()}${SERVICE_API}/${
      params.serviceID
    }/access-endpoints`,
    {
      params: {
        ...params,
        ...getPermissionRouteParams()
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};
