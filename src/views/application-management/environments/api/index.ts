import axios from 'axios';
import qs from 'query-string';
import { ListQuery, ListResult } from '@/types/global';
import router from '@/router';
import _ from 'lodash';
import ResourceKinds, {
  GlobalNamespace,
  NAMESPACES,
  apiVersion
} from '@/views/config/resource-kinds';
import { EnvironmentRow, EnvironFormData } from '../config/interface';

export const ENVIRONMENT_API = 'environments';

export const PROJECT_API = '/projects';

export { GlobalNamespace, NAMESPACES, ResourceKinds, apiVersion };

const generateEnvironmentAPI = (params: {
  namespace: string;
  name?: string;
}) => {
  const { name, namespace } = params;
  if (name) {
    return `${NAMESPACES}/${namespace}/${ENVIRONMENT_API}/${name}`;
  }
  return `${NAMESPACES}/${namespace}/${ENVIRONMENT_API}`;
};

export const PROJECT_API_PREFIX = () => {
  return `/projects/${router.currentRoute.value.params.projectId}`;
};

export const getPermissionRouteParams = () => {
  const { params } = router.currentRoute.value;
  return { projectID: params?.projectId };
};

export interface QueryType extends ListQuery {
  extract?: string[];
  sort?: string[];
}

export function queryEnvironmentsList(params: ListQuery, token?) {
  const url = generateEnvironmentAPI({ namespace: params.namespace as string });

  return axios.get<ListResult<EnvironmentRow>>(url, {
    params: _.omit(params, ['namespace']),
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryEnvironments(params: ListQuery, token?) {
  const url = generateEnvironmentAPI({ namespace: params.namespace as string });

  return axios.get<ListResult<EnvironmentRow>>(url, {
    params: _.omit(params, ['namespace']),
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}
export function queryEnvironmentList(params: ListQuery, token?) {
  const url = generateEnvironmentAPI({ namespace: params.namespace as string });

  return axios.get<ListResult<EnvironmentRow>>(url, {
    params: {
      ..._.omit(params, ['namespace'])
    },
    cancelToken: token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryItemEnvironments(params: {
  environmentName: string;
  namespace: string;
}) {
  const url = generateEnvironmentAPI({
    namespace: params.namespace,
    name: params.environmentName
  });

  return axios.get(url);
}

export function createEnvironment(params: {
  data: EnvironFormData;
  namespace: string;
}) {
  const url = generateEnvironmentAPI({ namespace: params.namespace });

  return axios.post(url, params.data);
}

export function cloneEnvironment(data: EnvironFormData, environmentID: string) {
  return axios.post(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${environmentID}/clone`,
    data
  );
}

export function deleteEnvironment(data: { items: Record<string, any>[] }) {
  return axios.delete(`${PROJECT_API_PREFIX()}${ENVIRONMENT_API}`, { data });
}

export function updateEnvironment(data: EnvironFormData) {
  return axios.put(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${data.id}`,
    data
  );
}

export function stopEnvironment(data: { id: string }) {
  return axios.post(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${data.id}/stop`
  );
}

export function startEnvironment(data: { id: string }) {
  return axios.post(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${data.id}/start`
  );
}

export function applyEnvironment(data: { id: string; data: any }) {
  return axios.post(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${data.id}/apply`,
    data.data
  );
}

export function exportEnvironment(data: {
  id: string;
  data: { id: string[] };
}) {
  const url = `/v1${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${
    data.id
  }/export?${qs.stringify(data.data)}`;
  return url;
}

export const queryEnvironmentAvailableDefinitions = (
  params: {
    environmentID: string;
    sort?: string[];
  },
  token?
) => {
  return axios.get(
    `${PROJECT_API_PREFIX()}${ENVIRONMENT_API}/${
      params.environmentID
    }/resource-definitions`,
    {
      params: {
        ..._.omit(params, ['environmentID'])
      },
      cancelToken: token,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    }
  );
};

// for custom service ui
export const queryEnvironmentConnector = (
  params: {
    projectID: string;
    environmentID: string;
  },
  token?
) => {
  return axios.get(
    `/projects/${params.projectID}/environments/${params.environmentID}`,
    {
      cancelToken: token
    }
  );
};
