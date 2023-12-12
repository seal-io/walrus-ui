import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import { BU } from '../types';

const PROXY_API = '/proxy/api/v1/namespaces';
const STORAGE_API = `/proxy/apis/storage.k8s.io/v1/namespaces`;

export const KuberByNamespace: Record<string, any> = {
  // secrets
  [BU.K8sSecretSelectByNamespace]: {
    request: async (params: { connectorID: string; namespace: string }) => {
      return axios.get(`${PROXY_API}/${params.namespace}/secrets`, {
        params: {
          connectorID: params.connectorID
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform: (data) => {
      return _.map(data.items, (item) => {
        return {
          label: item.metadata.name,
          value: item.metadata.name
        };
      });
    }
  },
  // configmaps
  [BU.K8sConfigMapSelectByNamespace]: {
    request: async (params: { connectorID: string; namespace: string }) => {
      return axios.get(`${PROXY_API}/${params.namespace}/configmaps`, {
        params: {
          connectorID: params.connectorID
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform: (data: any) => {
      return _.map(data.items, (item) => {
        return {
          label: item.metadata.name,
          value: item.metadata.name
        };
      });
    }
  },
  // storageClasses
  [BU.K8sStorageClassSelectByNamespace]: {
    request: async (params: { connectorID: string; namespace: string }) => {
      return axios.get(`${PROXY_API}/${params.namespace}/storageClasses`, {
        params: {
          connectorID: params.connectorID
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform: (data: any) => {
      return _.map(data.items, (item) => {
        return {
          label: item.metadata.name,
          value: item.metadata.name
        };
      });
    }
  }
};
export default {};
