import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import { SILENCEAPI } from '@/api/config';
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { websocketEventType } from '@/views/config';

interface RequestConfig {
  url: string;
  handler: (data: any) => any;
  beforeReconnect?: () => void;
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
    return JSON.parse(str);
  });
};

const findMatchingClosingBracket = (inputStr, startIndex) => {
  let count = 0;
  for (let i = startIndex; i < inputStr.length; i += 1) {
    if (inputStr[i] === '{') {
      count += 1;
    } else if (inputStr[i] === '}') {
      count -= 1;
    }

    if (count === 0) {
      return i;
    }
  }
  return -1;
};

const findValidJSONStrings = (inputStr) => {
  const validJSONStrings: any[] = [];
  let startIndex = 0;

  while (startIndex < inputStr.length) {
    const openingBraceIndex = inputStr.indexOf('{', startIndex);
    if (openingBraceIndex === -1) {
      break; // 没有更多的开括号了
    }

    const closingBraceIndex = findMatchingClosingBracket(
      inputStr,
      openingBraceIndex
    );
    if (closingBraceIndex === -1) {
      // 如果找不到匹配的闭括号，将 startIndex 设置为下一个字符的索引
      startIndex = openingBraceIndex + 1;
    } else {
      const jsonString = inputStr.substring(
        openingBraceIndex,
        closingBraceIndex + 1
      );
      try {
        const data = JSON.parse(jsonString);
        validJSONStrings.push(data);
      } catch (error) {
        // 忽略无效的 JSON
      }

      startIndex = closingBraceIndex + 1;
    }
  }

  return validJSONStrings;
};

const parseData = (data) => {
  const res = findValidJSONStrings(data);
  return res;
};
export const createAxiosToken = () => {
  const { CancelToken } = axios;
  const { source } = CancelToken;
  return source();
};

export const sliceData = (data, loaded, loadedSize) => {
  const result = data.slice(loadedSize.value);
  loadedSize.value = loaded;
  return result;
};
export function useSetChunkRequest() {
  let timer: any = null;
  const loaded = ref(0);
  const total = ref(0);
  const requestReadyState = ref(3);
  const axiosToken = ref<any>(null);
  const requestConfig = ref<any>({});
  const totalCount = 5;
  const retryCount = ref(totalCount);
  const particalConfig = { params: {}, contentType: 'json' };

  const reset = () => {
    loaded.value = 0;
    total.value = 0;
    requestReadyState.value = 3;
  };

  const resetResultSchema = (result) => {
    return _.map(result, (data) => {
      if (data.type === websocketEventType.DELETE) {
        data.ids = _.map(data.items, (item) => item.id);
      }
      data.collection = data.items || [];
      return data;
    });
  };

  /**
   *
   * @param param0
   *  result:{type: create | update | delete, items:object[]}
   */
  const axiosChunkRequest = async ({
    url,
    handler,
    beforeReconnect,
    params = {},
    contentType = 'json'
  }: RequestConfig) => {
    reset();
    axiosToken.value?.cancel?.();
    axiosToken.value = createAxiosToken();
    const loadedSize = { value: 0 };
    try {
      const { request } = await axios.get(url, {
        params: {
          ...params,
          watch: true
        },
        headers: {
          _action: SILENCEAPI
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

          let result = response;
          let cres = '';
          if (contentType === 'json') {
            const currentRes = sliceData(response, e.loaded, loadedSize);
            result = parseData(currentRes);
            result = resetResultSchema(result);
            cres = currentRes;
          }

          handler(result);
          console.log('chunkrequest===', { result, url, cres });
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
    retryCount.value = totalCount;
    clearTimeout(timer);
    axiosChunkRequest(requestConfig.value);
    return axiosToken.value;
  };
  watch(
    () => requestReadyState.value,
    (val) => {
      if (val === 4 && retryCount.value > 0) {
        requestConfig.value.beforeReconnect?.();
        clearTimeout(timer);
        timer = setTimeout(() => {
          axiosChunkRequest(requestConfig.value);
        }, 2 ** (totalCount - retryCount.value) * 1000);
      }
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    reset();
    requestConfig.value.beforeReconnect = null;
    axiosToken.value?.cancel?.();
    clearTimeout(timer);
    window.removeEventListener('unbeforeunload', () => {
      axiosToken.value?.cancel?.();
    });
  });
  onMounted(() => {
    window.addEventListener('unbeforeunload', () => {
      axiosToken.value?.cancel?.();
    });
  });
  return {
    setChunkRequest
  };
}
