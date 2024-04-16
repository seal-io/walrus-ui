// silence request no toast when response error
export const SILENCEAPI = 'silence';

// no permission location to login
export const AUTH_CODE = [401];

// login page router
export const LoginRouteName = 'Login';

// api response language weights
export const localeMap = {
  'en-US': 'en;q=0.9,zh;q=0.8',
  'zh-CN': 'zh;q=0.9,en;q=0.8'
};

// those apis has not version prefix. /v1
export const NoBaseURLApiList: string[] = [
  '/identify',
  '/account',
  '/openapi',
  '/debug/version',
  '/cli',
  '/proxy',
  '/walrus-file-hub'
];

export const responseStatusMap = {
  401: 'common.permission.401',
  403: 'common.permission.403'
};

export const noToastAPI: string[] = [];

export const FieldManagerMethods = ['post', 'put'];

export const overrideRequestConfig = (config) => {
  if (FieldManagerMethods.includes(config.method)) {
    config.params = {
      ...config.params,
      fieldManager: 'walrus-ui'
    };
  }
  if (config.params?.fieldSelector) {
    config.params.fieldSelector = `metadata.name=${config.params.fieldSelector}`;
  }
  return config;
};

export default {};
