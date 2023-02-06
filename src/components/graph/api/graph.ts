import axios from 'axios';
import qs from 'query-string';
import { NodeItem, EdgeItem } from '../config/interface';

interface Params {
  // resource: string;
  // tags: string[];
  // license: string;
  // vulnerable: boolean;
  // package: string;
  // withVulnerabilities: boolean;
  // depth: number;
  // limit: number;
  query?: string;
}
interface Result {
  Nodes: NodeItem[];
  Edges: EdgeItem[];
}
export function queryReSourceData(params: Params) {
  // const dataapi = 'api/resources/graph'
  const dataapi = '/graphs';
  return axios.get<Result>(dataapi, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export default {};
