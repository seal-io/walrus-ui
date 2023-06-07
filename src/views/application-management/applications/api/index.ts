import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import router from '@/router';
import { AppRowData, EndPointRow } from '../config/interface';

// some params for permission
export const getPermissionRouteParams = () => {
  const { params } = router.currentRoute.value;
  return { projectID: params?.projectId };
};

// interface ParamsType extends Pagination {}
export interface ResultType {
  items: AppRowData[];
  pagination: Pagination;
}
export interface QueryType extends Pagination {
  projectID: string;
}
export const queryApplications = (params: QueryType) => {
  return axios.get<ResultType>(`/services`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createApplication = (data) => {
  return axios.post(
    `/services?${qs.stringify({ projectID: data.projectID })}`,
    data
  );
};
export const deleteApplication = ({ data, projectID }) => {
  return axios.delete(`/services?${qs.stringify({ projectID })}`, { data });
};
export const deployApplication = (data) => {
  return axios.post(
    `/service?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const updateApplication = (data) => {
  return axios.put(
    `/services/${data.id}?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const queryItemApplication = (params) => {
  return axios.get(`/services/${params.id}`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
// ========instance======
export const queryApplicationInstances = (params) => {
  return axios.get(`/service`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryItemApplicationInstances = (params) => {
  return axios.get(`/service/${params.id}`, {
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
  return axios.get(`/service/${params.id}/outputs`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const deleteApplicationInstance = (data) => {
  return axios.delete(
    `/service/${data.id}?${qs.stringify({
      force: data.force,
      ...getPermissionRouteParams()
    })}`
  );
};

export const upgradeApplicationInstance = (data) => {
  return axios.put(
    `/service/${data.id}/upgrade?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const cloneApplicationInstance = (data: {
  id: string;
  name: string;
}) => {
  return axios.post(
    `/service/${data.id}/clone?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const diffInstanceSpec = (params: { serviceID: string }) => {
  return axios.get(`/service/${params.serviceID}/diff-latest`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryInstanceResourceGraph = (params: { serviceID: string }) => {
  return axios.get(`/service/${params.serviceID}/graph`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
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
  return axios.get(`/service-revisions`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryApplicationRevisionsDetail = (params: { id: string }) => {
  return axios.get(`/service-revisions/${params.id}`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const deleteApplicationRevisions = (data: { id: string }[]) => {
  return axios.delete(
    `/service-revisions?${qs.stringify(getPermissionRouteParams())}`,
    { data }
  );
};

export const diffRevisionSpec = (params: { id: string; serviceID: string }) => {
  return axios.get(`/service-revisions/${params.id}/diff-latest`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryRevisionChange = (params: {
  id: string;
  serviceID: string;
}) => {
  return axios.get(`/service-revisions/${params.id}/diff-previous`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const rollbackInstance = (data: { id: string }) => {
  return axios.post(
    `/service-revisions/${data.id}/rollback-service?${qs.stringify(
      getPermissionRouteParams()
    )}`
  );
};

export const rollbackApplication = (data: { id: string }) => {
  return axios.post(
    `/service-revisions/${data.id}/rollback-applications?${qs.stringify(
      getPermissionRouteParams()
    )}`
  );
};
// ===========resource==========
export const queryApplicationResource = (
  params: ApplicationRevisionParams,
  token?
) => {
  return axios.get(`/service-resources`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationResourceKeys = (params: { id: string }) => {
  return axios.get(`/service-resources/${params.id}/keys`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationResourceLogs = (params: { id: string }) => {
  return axios.get(`/service-resources/${params.id}/log`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryApplicationResourceExec = (params: { id: string }) => {
  return axios.get(`/service-resources/${params.id}/exec`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
type EndPointResult = EndPointRow[];
export const queryInstanceEndpoints = (
  params: { serviceID: string },
  token
) => {
  return axios.get<EndPointResult>(
    `/services/${params.serviceID}/access-endpoints`,
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

export const queryProjectSecrets = (params) => {
  return axios.get(`/projects/${params.projectID}/secrets`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const querySecrets = (params) => {
  return axios.get(`/secrets`, {
    params: {
      ...params,
      ...getPermissionRouteParams()
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
