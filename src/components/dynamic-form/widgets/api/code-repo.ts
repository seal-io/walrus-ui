import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import { BU } from '../types';

export const CodeRepo: Record<string, any> = {
  [BU.CodeRepositorySelect]: {
    request: async (
      params: {
        connectorID: string;
        query: string;
        projectID: string;
        isProjectConnector: boolean;
      },
      token?
    ) => {
      let url = `/connectors/${params.connectorID}/repositories`;
      if (params.isProjectConnector) {
        url = `/projects/${params.projectID}${url}`;
      }
      return axios.get(url, {
        params: {
          page: 1,
          perPage: 50,
          query: params.query
        },
        cancelToken: token,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
    },
    transform: (data) => {
      return _.map(data, (item) => {
        return {
          value: `${item.Namespace}/${item.Name}`,
          label: `${item.Namespace}/${item.Name}`
        };
      });
    },
    queryBranches: async (
      params: {
        connectorID: string;
        repository: string;
        projectID: string;
        isProjectConnector: boolean;
      },
      token?
    ) => {
      let url = `/connectors/${params.connectorID}/repository-branches`;
      if (params.isProjectConnector) {
        url = `/projects/${params.projectID}${url}`;
      }
      const { data } = await axios.get(url, {
        params: {
          repository: params.repository,
          page: -1
        },
        cancelToken: token,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      });
      return _.map(data || [], (item) => {
        return {
          value: item.Name,
          label: item.Name
        };
      });
    }
  }
};

export default {};
