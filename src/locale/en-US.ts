import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeBasicProfile from '@/views/profile/basic/locale/en-US';

import localeSuccess from '@/views/result/success/locale/en-US';
import localeError from '@/views/result/error/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserInfo from '@/views/user/info/locale/en-US';
import localeUserSetting from '@/views/user/setting/locale/en-US';
import localeUserSystem from '@/views/user/system/locale/en-US';

import intergrationLocalEn from '@/views/intergration/locale/en-US';

import localPolicy from '@/views/policy/locale/en-US';
import localeLogs from '@/views/logs/locale/en-US';
import localeProjects from '@/views/projects/locale/en-US';
import localeLicense from '@/views/license/locale/en-US';

import localeReport from '@/views/report/locale/en-US';
import localeSbom from '@/views/soft-bom/locale/en-US';
import localePlugins from '@/views/user/plugins/locale/en-US';

import localeVulner from '@/views/vulnerability/locale/en-US';
import localeSummary from '@/views/applications/locale/en-US';

import localeGraph from '@/components/graph/locale/en-US';
import localeDashboard from '@/views/dashboard/locale/en-US';
import localeCommon from './en-US/common';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'navbar.totalView': 'Dashboard',
  'navbar.intergration': 'Integration',
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

  ...localeBasicProfile,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...intergrationLocalEn,
  ...localPolicy,
  ...localeLogs,
  ...localeProjects,
  ...localeUserSystem,
  ...localeReport,
  ...localeLicense,
  ...localeSbom,
  ...localePlugins,
  ...localeVulner,
  ...localeSummary,
  ...localeGraph,
  ...localeDashboard,
};
