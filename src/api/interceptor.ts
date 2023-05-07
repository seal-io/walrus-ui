import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import router from '@/router';
import { get } from 'lodash';
import i18n from '@/locale/index';
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
console.log('import.meta:', import.meta);

const localeMap = {
  'en-US': 'en;q=0.9,zh;q=0.8',
  'zh-CN': 'zh;q=0.9,en;q=0.8'
};
const authApiList = [
  '/account/login',
  '/account/info',
  '/account/logout',
  '/openapi',
  '/debug/version'
];
const noToastAPI = [
  '/policies/_/test',
  '/notifiers/_/test',
  '/container-registries/verify',
  '/container-registries/_/test'
];
/**
 * 200: success
 * 440: login Timeout
 * 500: server error
 * 403,401: Unauthorized
 * 404: no page on server
 */

// let responseModalTimer: any = null;
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const url = config.url || '';
    const { locale } = i18n.global;
    console.log('local===', locale);
    config.headers = {
      'Accept-Language': localeMap[locale] || 'en'
    };
    if (authApiList.includes(url)) {
      config.baseURL = '';
    }
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
    // const isCancel = axios.isCancel(error)
    console.log('error:', error.response, axios.isCancel(error));
    const reqUrl = get(error.response, 'config.url');
    const response = get(error, 'response') || {};
    const data = get(response, 'data') || {};
    const result = {
      code: data?.status,
      msg: data?.message || response.statusText,
      data: data?.data,
      api: reqUrl
    };
    if (!noToastAPI.includes(reqUrl) && !axios.isCancel(error)) {
      Message.error({
        // id: 'request_error_01',
        content: result?.data?.msg || result.msg || 'Request Error',
        duration: 3 * 1000
      });
    }
    if ([401, 403, 440].includes(result.code)) {
      const userStore = useUserStore();
      const currentRoute = router.currentRoute.value.name;
      userStore.permissionCheckFailed();
      if (currentRoute !== 'login') {
        window.location.reload();
      }
      // clearTimeout(responseModalTimer);
      // responseModalTimer = setTimeout(() => {
      //   Modal.error({
      //     title: i18n.global.t('user.login.validate'),
      //     content: () =>
      //       h(
      //         'div',
      //         { style: { 'text-align': 'center' } },
      //         i18n.global.t('user.login.info')
      //       ),
      //     okText: i18n.global.t('user.login.relogin'),
      //     async onOk() {
      //       const userStore = useUserStore();
      //       const currentRoute = router.currentRoute.value.name;
      //       await userStore.logout();
      //       // TODO
      //       if (currentRoute !== 'login') {
      //         window.location.reload();
      //       }
      //     },
      //   });
      // }, 50);
    }
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    return Promise.reject(result);
  }
);
