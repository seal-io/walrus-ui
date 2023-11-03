import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import { BU } from '../types';
import { parseXMLFragment, XMLParser } from '../../config/utils';
import { Caller, Item } from '../config/interface';
import { RepoPull } from './repo';
import { KuberByNamespace } from './kuber-by-namespace';

const PROXY_API = '/proxy/api/v1';

const awsRegionOptions = {
  item: 'item',
  label: 'regionName',
  value: 'regionEndpoint'
};
const awsInstanceOptions = {
  item: 'instanceTypeSet',
  label: 'instanceType',
  value: 'instanceType'
};

export const BCWidget: Record<string, Caller> = {
  ...RepoPull,
  ...KuberByNamespace,
  // namespace
  [BU.NamespaceSelect]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`${PROXY_API}/namespaces`, {
        params,
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
  // secrets
  [BU.SecretSelect]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`${PROXY_API}/secrets`, {
        params,
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
  [BU.ConfigMapSelect]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`${PROXY_API}/configmaps`, {
        params,
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
  [BU.StorageClassSelect]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`${PROXY_API}/storageClasses`, {
        params,
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
  // aws region
  [BU.AWSRegion]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`/proxy/ec2.ap-east-1.amazonaws.com`, {
        params: {
          ...params,
          Version: '2016-11-15',
          Action: 'DescribeRegions'
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform: (data) => {
      return parseXMLFragment(data, awsRegionOptions);
    }
  },
  // aws instance type
  [BU.AWSInstanceType]: {
    request: async (params: { connectorID: string }) => {
      return axios.get(`/proxy/ec2.ap-east-1.amazonaws.com`, {
        params: {
          ...params,
          Version: '2016-11-15',
          Action: 'DescribeInstanceTypes'
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform(data) {
      const result: Item[] = [];
      const docs = XMLParser(data);
      const items = docs.querySelectorAll(awsInstanceOptions.label);
      items.forEach(function (item: any) {
        const label = item.textContent;
        result.push({
          label,
          value: label
        });
      });
      return result;
    }
  },
  // docker image
  [BU.ImageSelect]: {
    request: async (params: { q: string }, token?) => {
      return axios.get(
        `/proxy/https://hub.docker.com/api/content/v1/products/search`,
        {
          params: {
            ...params,
            source: 'community'
          },
          cancelToken: token,
          paramsSerializer: (obj) => {
            return qs.stringify(obj);
          }
        }
      );
    },
    transform(data) {
      return _.map(data.summaries, (item) => {
        return {
          label: item.name,
          value: item.name
        };
      });
    }
  },
  [BU.ImageTagSelect]: {
    request: async (params: { user: string; repository: string }) => {
      return axios.get(
        `/proxy/https://hub.docker.com/v2/repositories/${params.user}/${params.repository}/tags`
      );
    },
    transform(data, params) {
      return _.map(data.results, (item) => {
        return {
          label: item.name,
          value: item.name
        };
      });
    }
  }
};

export function queryConnectorRepositories(params: { connectorID: string }) {
  return axios.get(`/connectors/${params.connectorID}/repositories`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export function queryConnectorRepositoriesBranch(params: {
  connectorID: string;
}) {
  return axios.get(`/connectors/${params.connectorID}/repository-branches`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export const queryEnvironmentConnector = (params: {
  projectID: string;
  environmentID: string;
}) => {
  return axios.get(
    `/projects/${params.projectID}/environments/${params.environmentID}`
  );
};
export default {};
