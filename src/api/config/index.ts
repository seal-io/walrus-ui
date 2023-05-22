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

// those apis has not version prefix. e.g. /v1/applications/
export const authApiList: string[] = [
  '/account/login',
  '/account/info',
  '/account/logout',
  '/openapi',
  '/debug/version'
];

export const noToastAPI: string[] = [];

export default {};