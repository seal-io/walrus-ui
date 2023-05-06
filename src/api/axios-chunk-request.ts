import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import { testData } from './test';

interface RequestConfig {
  url: string;
  handler: (data: any) => any;
  params?: object;
  contentType?: 'json' | 'text';
}

export const sliceJsonStr = (text: string) => {
  if (!text) return [];
  const result: string[] = [];
  for (let i = 0, j = 0, start = 0; i < text.length; i += 1) {
    if (text.charAt(i) === '{') {
      j += 1;
    }
    if (text.charAt(i) === '}') {
      j -= 1;
    }
    if (j === 0 && i !== start) {
      result.push(text.slice(start, i + 1));
      start = i + 1;
    }
  }
  return result;
};
export const parseJsonStr = (list: string[]) => {
  return _.map(list, (str) => {
    console.log('parseJsonStr=======', str);
    return JSON.parse(str);
  });
};

const parseData = (data) => {
  const list = sliceJsonStr(data);
  const res = parseJsonStr(list);
  return res;
};
export const createAxiosToken = () => {
  const { CancelToken } = axios;
  const { source } = CancelToken;
  return source();
};

export const sliceBlobData = async (data, loaded, loadedSize) => {
  const blob = new Blob([data]);
  const subText = blob.slice(loadedSize.value);
  const result = await subText.text();
  loadedSize.value = loaded - loadedSize.value;
  console.log('blob===', blob.size, result, loadedSize.value, loaded, data);
  return [result];
};
// upgrade to 1.1.3, cache-control: 'no-cache'
export default function axiosChunkRequest({
  url,
  handler,
  params = {},
  contentType = 'json'
}: RequestConfig) {
  const axiosToken = createAxiosToken();
  const loadedSize = { value: 0 };
  axios.get(url, {
    params: {
      ...params,
      watch: true
    },
    cancelToken: axiosToken.token,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
    async onDownloadProgress(e) {
      const { response } = e.currentTarget;
      const { loaded } = e;
      // const resultList = await sliceBlobData(response, loaded, loadedSize);
      const res = contentType === 'json' ? parseData(response) : response;
      handler(res);
      console.log(`response==chunk====${qs.stringify(params)}`, e, {
        url,
        res
      });
    }
  });
  return axiosToken;
}
