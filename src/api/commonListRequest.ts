import axios, { CancelToken } from 'axios';
import qs from 'query-string';

export function commonRequestList(api, params?) {
  return axios.get(`${api}`, {
    params: {
      page: 1,
      perPage: -1,
      ...params
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

export default {};
