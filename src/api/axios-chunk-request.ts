import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import { ref, watch, onBeforeUnmount } from 'vue';

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
export function useSetChunkRequest() {
  const loaded = ref(0);
  const total = ref(0);
  const requestReadyState = ref(3);
  const axiosToken = ref<any>(null);
  const requestConfig = ref<any>({});
  const retryCount = ref(3);
  const particalConfig = { params: {}, contentType: 'json' };

  const axiosChunkRequest = async ({
    url,
    handler,
    params = {},
    contentType = 'json'
  }: RequestConfig) => {
    requestReadyState.value = 3;
    axiosToken.value?.cancel?.();
    axiosToken.value = createAxiosToken();
    const loadedSize = { value: 0 };
    try {
      const { request } = await axios.get(url, {
        params: {
          ...params,
          watch: true
        },
        cancelToken: axiosToken.value.token,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        },
        async onDownloadProgress(e) {
          const { response, readyState } = e.currentTarget;
          requestReadyState.value = readyState;
          loaded.value = e.loaded || 0;
          total.value = e.total || 0;
          // const resultList = await sliceBlobData(response, loaded, loadedSize);
          const res = contentType === 'json' ? parseData(response) : response;
          handler(res);
          console.log(
            `response==chunk====${qs.stringify(params)}`,
            requestReadyState.value,
            readyState,
            e,
            {
              url,
              res
            }
          );
        }
      });
      requestReadyState.value = request?.readyState;
      if (retryCount.value > 0) {
        retryCount.value -= 1;
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        requestReadyState.value = 4;
        if (retryCount.value > 0) {
          retryCount.value -= 1;
        }
      }
    }

    return axiosToken;
  };

  const setChunkRequest = (config: RequestConfig) => {
    requestConfig.value = { ...particalConfig, ...config };
    loaded.value = 0;
    total.value = 0;
    retryCount.value = 3;
    requestReadyState.value = 3;
    axiosChunkRequest(requestConfig.value);
  };
  watch(
    () => requestReadyState.value,
    (val) => {
      if (val === 4 && retryCount.value > 0) {
        axiosChunkRequest(requestConfig.value);
      }
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    axiosToken.value?.cancel?.();
  });

  return {
    setChunkRequest
  };
}
// upgrade to 1.1.3
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
