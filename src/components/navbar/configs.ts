interface NavDataMap {
  name: string;
  label: string;
  active: string;
}
export const NO_LOGIN_CHECK_PATH = ['eventReport'];

export const navDataList: NavDataMap[] = [
  { name: 'dashboardMain', label: 'navbar.totalView', active: 'dashboard' },
  {
    name: 'projectsList',
    label: 'navbar.appmanagement',
    active: 'appManagement',
  },
  {
    name: 'costAnalyseList',
    label: 'navbar.costmanagement',
    active: 'costManagement',
  },
  {
    name: 'connectorsList',
    label: 'navbar.operatorhub',
    active: 'operationHub',
  },
  // {
  //   name: 'graphMain',
  //   label: 'navbar.graph',
  //   active: 'graphIndex',
  // },
  // {
  //   name: 'reourcesList',
  //   label: 'navbar.resource',
  //   active: 'projects',
  // },
];
export default {
  NO_LOGIN_CHECK_PATH,
};
