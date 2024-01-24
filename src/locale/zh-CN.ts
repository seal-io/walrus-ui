import localeLogin from '@/views/login/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserSystem from '@/views/system/locale/zh-CN';

import localeDashboard from '@/views/dashboard/locale/zh-CN';

import localeApplications from '@/views/application-management/locale/zh-CN';
import localeCost from '@/views/cost-management/locale/zh-CN';
import localeOperation from '@/views/operation-hub/locale/zh-CN';

import localeProfile from '@/views/profile/locale/zh-CN';
import localeCatalogs from '@/views/operation-hub/catalogs/locale/zh-CN';
import localeResourceDefinition from '@/views/operation-hub/resource-definitions/locale/zh-CN';

import localeWorkflow from '@/views/application-management/workflows/locale/zh-CN';
import localeEnvironment from '@/views/application-management/environments/locale/zh-CN';

import localeCommon from './zh-CN/common';

import localeSettings from './zh-CN/settings';
import localeMenu from './zh-CN/menu';
import localePermissionResource from './zh-CN/permission-resource';

export default {
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.user': '个人中心',
  'navbar.docs': '文档中心',
  'navbar.appmanagement': '应用管理',
  'navbar.costmanagement': '成本管理',
  'navbar.operatorhub': '运维中心',
  'navbar.action.locale': '切换为中文',
  'navbar.totalView': '概览',
  ...localeCommon,
  ...localeSettings,
  ...localeLogin,

  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserSystem,
  ...localeDashboard,
  ...localeApplications,
  ...localeCost,
  ...localeOperation,
  ...localeProfile,
  ...localeMenu,
  ...localePermissionResource,
  ...localeCatalogs,
  ...localeWorkflow,
  ...localeResourceDefinition,
  ...localeEnvironment
};
