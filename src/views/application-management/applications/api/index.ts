import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';
import { AppRowData, EndPointRow } from '../config/interface';

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
  return axios.post(`/applications`, data);
};
export const deleteApplication = (data) => {
  return axios.delete(`/applications`, { data });
};
export const deployApplication = (data) => {
  return axios.post(`/applications/${data.id}/deploy`, data);
};

export const updateApplication = (data) => {
  return axios.put(`/applications/${data.id}`, data);
};

export const queryItemApplication = (params) => {
  return axios.get(`/applications/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
// ========instance======
export const queryApplicationInstances = (params) => {
  return axios.get(`/application-instances`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryItemApplicationInstances = (params) => {
  return axios.get(`/application-instances/${params.id}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const deleteApplicationInstance = (data) => {
  return axios.delete(`/application-instances`, { data });
};
export const upgradeApplicationInstance = (data) => {
  return axios.put(`/application-instances/${data.id}/upgrade`, data);
};
// =========history================
interface ApplicationRevisionParams extends Pagination {
  instanceID?: string;
}

export const queryApplicationRevisions = (
  params: ApplicationRevisionParams
) => {
  return axios.get(`/application-revisions`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const deleteApplicationRevisions = (data: { id: string }[]) => {
  return axios.delete(`/application-revisions`, { data });
};
// ===========resource==========
export const queryApplicationResource = (params: ApplicationRevisionParams) => {
  return axios.get(`/application-resources`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationResourceKeys = (params: { id: string }) => {
  return axios.get(`/application-resources/${params.id}/keys`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};

export const queryApplicationResourceLogs = (params: { id: string }) => {
  return axios.get(`/application-resources/${params.id}/log`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
export const queryApplicationResourceExec = (params: { id: string }) => {
  return axios.get(`/application-resources/${params.id}/exec`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
interface EndPointResult {
  endpoints: EndPointRow[];
  pagination: Pagination;
}
export const queryInstanceEndpoints = (params: { instanceID: string }) => {
  return axios.get<EndPointResult>(
    `/application-instances/${params.instanceID}/access-endpoints`,
    {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

export const queryProjectSecrets = (params) => {
  return axios.get(`/projects/${params.projectID}/secrets`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
};
