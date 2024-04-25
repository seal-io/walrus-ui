import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import router from '@/router';
import { some, get } from 'lodash';
import i18n from '@/locale/index';
import {
  SILENCEAPI,
  AUTH_CODE,
  LoginRouteName,
  localeMap,
  NoBaseURLApiList,
  responseStatusMap,
  noToastAPI,
  FieldManagerMethods,
  overrideRequestConfig
} from './config';
// import { getToken } from '@/utils/auth';
// import { h } from 'vue';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

/**
 * 200: success
 * 440: login Timeout
 * 500: server error
 * 403,401: Unauthorized
 * 404: no page on server
 */

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const url = config.url || '';
    const { locale } = i18n.global;
    config.headers = {
      ...config.headers,
      'Accept-Language': localeMap[locale] || 'en'
    };
    if (some(NoBaseURLApiList, (api) => url.startsWith(api))) {
      config.baseURL = '';
    }
    if (config.headers._baseurl) {
      config.baseURL = config.headers._baseurl;
    }

    overrideRequestConfig(config);

    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response;
    return res;
  },
  (error) => {
    const requestAction = get(error.response, 'config.headers._action') || '';
    const reqUrl = get(error.response, 'config.url');
    const response = get(error, 'response') || {};
    const data = get(response, 'data') || {
      status: response?.status,
      statusText: response?.statusText
    };

    const msg =
      data?.message ||
      (get(responseStatusMap, data?.code)
        ? i18n.global.t(get(responseStatusMap, data?.code))
        : data.statusText);

    const result = {
      code: data?.code,
      msg,
      data: data?.data,
      api: reqUrl
    };
    console.log('result=====================', result);
    if (
      !noToastAPI.includes(reqUrl) &&
      !axios.isCancel(error) &&
      error.response &&
      requestAction !== SILENCEAPI
    ) {
      Message.error({
        id: get(responseStatusMap, data?.code)
          ? `request_error_${data?.code}}`
          : '',
        content: result.msg || 'Request Error',
        duration: 3 * 1000
      });
    }
    if (AUTH_CODE.includes(result.code)) {
      const userStore = useUserStore();
      const currentRoute = router.currentRoute.value.name;
      userStore.permissionCheckFailed();
      if (currentRoute !== LoginRouteName) {
        router.replace({ name: LoginRouteName });
      }
    }
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    return Promise.reject(result);
  }
);
