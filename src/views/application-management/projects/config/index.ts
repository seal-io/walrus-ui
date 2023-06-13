import dayjs from 'dayjs';

export enum ProjectRoles {
  Owner = 'project/owner',
  Member = 'project/member',
  Viewer = 'project/viewer'
}

export const projectRoles = [
  { label: 'applications.projects.role.owner', value: ProjectRoles.Owner },
  { label: 'applications.projects.role.member', value: ProjectRoles.Member },
  { label: 'applications.projects.role.viewer', value: ProjectRoles.Viewer }
];

export const basicInfoConfig = [
  { label: 'common.table.name', value: '', key: 'name' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'common.table.description',
    value: '',
    key: 'description',
    span: 2
  }
];

export const projectDetailTabs = [
  {
    label: 'menu.operatorHub.evniroment',
    value: 'enviroment',
    resource: 'Environments',
    component: 'EnviromentList'
  },
  {
    label: 'menu.operatorHub.variables',
    value: 'variables',
    resource: 'Secrets',
    component: 'SecretList'
  },
  {
    label: 'menu.operatorHub.connector',
    value: 'connector',
    resource: 'Connectors',
    component: 'ConnectorList',
    props: { scope: 'project' }
  }
];
export default {};
