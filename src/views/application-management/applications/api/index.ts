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
  return axios.get<ResultType>(`/applications`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const createApplication = (data) => {
  return axios.post(
    `/applications?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};
export const deleteApplication = (data) => {
  return axios.delete(
    `/applications?${qs.stringify(getPermissionRouteParams())}`,
    { data }
  );
};
export const deployApplication = (data) => {
  return axios.post(
    `/application-instances?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const updateApplication = (data) => {
  return axios.put(
    `/applications/${data.id}?${qs.stringify(getPermissionRouteParams())}`,
    data
  );
};

export const queryItemApplication = (params) => {
  return axios.get(`/applications/${params.id}`, {
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
  return axios.get(`/application-instances`, {
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
  return axios.get(`/application-instances/${params.id}`, {
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
  return axios.get(`/application-instances/${params.id}/outputs`, {
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
    `/application-instances/${data.id}?${qs.stringify({
      force: data.force,
      ...getPermissionRouteParams()
    })}`
  );
};

export const upgradeApplicationInstance = (data) => {
  return axios.put(
    `/application-instances/${data.id}/upgrade?${qs.stringify(
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
    `/application-instances/${data.id}/clone?${qs.stringify(
      getPermissionRouteParams()
    )}`,
    data
  );
};

export const diffInstanceSpec = (params: { instanceID: string }) => {
  return axios.get(`/application-instances/${params.instanceID}/diff-latest`, {
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
  instanceID?: string;
  sort?: string[];
}

export const queryApplicationRevisions = (
  params: ApplicationRevisionParams,
  token?
) => {
  return axios.get(`/application-revisions`, {
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
  return axios.get(`/application-revisions/${params.id}`, {
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
    `/application-revisions?${qs.stringify(getPermissionRouteParams())}`,
    { data }
  );
};

export const diffRevisionSpec = (params: {
  id: string;
  instanceID: string;
}) => {
  return axios.get(`/application-revisions/${params.id}/diff-latest`, {
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
  instanceID: string;
}) => {
  return axios.get(`/application-revisions/${params.id}/diff-previous`, {
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
    `/application-revisions/${data.id}/rollback-instances?${qs.stringify(
      getPermissionRouteParams()
    )}`
  );
};

export const rollbackApplication = (data: { id: string }) => {
  return axios.post(
    `/application-revisions/${data.id}/rollback-applications?${qs.stringify(
      getPermissionRouteParams()
    )}`
  );
};
// ===========resource==========
export const queryApplicationResource = (
  params: ApplicationRevisionParams,
  token?
) => {
  return axios.get(`/application-resources`, {
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
  return axios.get(`/application-resources/${params.id}/keys`, {
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
  return axios.get(`/application-resources/${params.id}/log`, {
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
  return axios.get(`/application-resources/${params.id}/exec`, {
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
  params: { instanceID: string },
  token
) => {
  return axios.get<EndPointResult>(
    `/application-instances/${params.instanceID}/access-endpoints`,
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
