import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeSuccess from '@/views/result/success/locale/en-US';
import localeError from '@/views/result/error/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserSystem from '@/views/system/locale/en-US';

import localeGraph from '@/components/graph/locale/en-US';
import localeDashboard from '@/views/dashboard/locale/en-US';

import localeApplications from '@/views/application-management/locale/en-US';
import localeCost from '@/views/cost-management/locale/en-US';
import localeOperation from '@/views/operation-hub/locale/en-US';

import localeProfile from '@/views/profile/locale/en-US';

import localeCommon from './en-US/common';
import localeSettings from './en-US/settings';
import localeMenu from './en-US/menu';
import localePermissionResource from './en-US/permission-resource';

export default {
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'User Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'navbar.docs': 'Docs',
  'navbar.appmanagement': 'App Management',
  'navbar.costmanagement': 'Cost Management',
  'navbar.operatorhub': 'Operation Hub',
  'navbar.action.locale': 'Switch to English',
  'navbar.totalView': 'Dashboard',
  'navbar.resource': 'Resource',
  'navbar.graph': 'Graph',
  'navbar.application': 'Applications',
  'navbar.policy': 'Policy',
  'navbar.logs': 'Logs',
  'navbar.projects': 'Projects',
  'navbar.license': 'License',
  'navbar.sbom': 'Components',
  'navbar.search.holder': 'Package or Vulnerability',
  'navbar.search.text': 'Vulnerability Search',
  ...localeCommon,
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserSystem,
  ...localeGraph,
  ...localeDashboard,
  ...localeApplications,
  ...localeCost,
  ...localeOperation,
  ...localeProfile,
  ...localeMenu,
  ...localePermissionResource
};
