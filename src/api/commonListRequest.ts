import axios, { CancelToken } from 'axios';
import qs from 'query-string';

export function commonRequestList(api) {
  return axios.get(`${api}`, {
    params: {
      page: 1,
      perPage: 1000,
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export default {};
