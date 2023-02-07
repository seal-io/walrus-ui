import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';
import localeUserSystem from '@/views/user/system/locale/zh-CN';

import localeProjects from '@/views/projects/locale/zh-CN';

import localeReport from '@/views/report/locale/zh-CN';

import localeGraph from '@/components/graph/locale/zh-CN';

import localeDashboard from '@/views/dashboard/locale/zh-CN';
import localeCommon from './zh-CN/common';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'navbar.totalView': '概览',
  'navbar.intergration': '集成',
  'navbar.resource': '资源',
  'navbar.graph': '图',
  'navbar.application': '应用',
  'navbar.policy': '策略',
  'navbar.logs': '日志',
  'navbar.projects': '项目',
  'navbar.license': '许可证',
  'navbar.sbom': '组件',
  'navbar.search.holder': '包名或漏洞名',
  'navbar.search.text': '漏洞查询',
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
  ...localeProjects,
  ...localeUserSystem,
  ...localeReport,
  ...localeGraph,
  ...localeDashboard,
};
