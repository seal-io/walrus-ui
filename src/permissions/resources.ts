export enum Resources {
  ApplicationInstances = 'applicationInstances',
  ApplicationResources = 'applicationResources',
  ApplicationRevisions = 'applicationRevisions',
  Applications = 'applications',
  Connectors = 'connectors',
  Costs = 'costs',
  Dashboards = 'dashboards',
  Environments = 'environments',
  ModuleCompletions = 'moduleCompletions',
  ModuleVersions = 'moduleVersions',
  Modules = 'modules',
  Perspectives = 'perspectives',
  Projects = 'projects',
  Roles = 'roles',
  Secrets = 'secrets',
  Settings = 'settings',
  SubjectRoles = 'subjectRoles',
  Subjects = 'subjects',
  Tokens = 'tokens'
}
export enum Actions {
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE'
}
export default [
  {
    resource: 'applicationInstances',
    title: '应用实例',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  { resource: 'applicationResources', title: '应用资源', actions: ['GET'] },
  {
    resource: 'applicationRevisions',
    title: '应用实例历史记录',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: 'applications',
    title: '应用',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: 'connectors',
    title: '连接器',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  { resource: 'costs', title: '成本分析', actions: ['POST'] },
  { resource: 'dashboards', title: '首页', actions: ['POST', 'GET'] },
  {
    resource: 'environments',
    title: '环境',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: 'moduleCompletions',
    title: 'AI编写模块',
    actions: ['GET', 'POST']
  },
  { resource: 'moduleVersions', title: '模块版本', actions: ['GET'] },
  {
    resource: 'modules',
    title: '模块',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: 'perspectives',
    title: '视图',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: 'projects',
    title: '项目',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  { resource: 'roles', title: '角色', actions: ['GET'] },
  {
    resource: 'secrets',
    title: '密钥',
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  { resource: 'settings', title: '配置管理', actions: ['GET', 'PUT'] },
  {
    resource: 'subjectRoles',
    title: '用户角色',
    actions: ['GET', 'POST', 'DELETE']
  },
  {
    resource: 'subjects',
    title: '用户管理',
    actions: ['GET', 'POST', 'DELETE']
  },
  { resource: 'tokens', title: 'Tokens', actions: ['GET', 'POST', 'DELETE'] }
];
