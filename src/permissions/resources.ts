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
const enum MenuOrder {
  Dashboards,
  ApplicationManagement,
  CostManagement,
  OperationHub,
  SystemSettings
}

export enum ResourcesOrder {
  ApplicationInstances = MenuOrder.ApplicationManagement,
  ApplicationResources = MenuOrder.ApplicationManagement,
  ApplicationRevisions = MenuOrder.ApplicationManagement,
  Applications = MenuOrder.ApplicationManagement,
  Connectors = MenuOrder.OperationHub,
  Costs = MenuOrder.CostManagement,
  Dashboards = MenuOrder.Dashboards,
  Environments = MenuOrder.OperationHub,
  ModuleCompletions = MenuOrder.OperationHub,
  ModuleVersions = MenuOrder.OperationHub,
  Modules = MenuOrder.OperationHub,
  Perspectives = MenuOrder.CostManagement,
  Projects = MenuOrder.ApplicationManagement,
  Roles = MenuOrder.SystemSettings,
  Secrets = MenuOrder.OperationHub,
  Settings = MenuOrder.SystemSettings,
  SubjectRoles = MenuOrder.SystemSettings,
  Subjects = MenuOrder.SystemSettings,
  Tokens = 999
}
export enum Actions {
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  All = '*'
}

export const permissionScope = {
  [Actions.All]: '所有权限',
  [Actions.DELETE]: '删除',
  [Actions.POST]: '新增',
  [Actions.GET]: '查询',
  [Actions.PUT]: '修改'
};

// resource actions
export default [
  {
    resource: Resources.ApplicationInstances,
    title: '应用实例',
    group: '应用管理',
    order: ResourcesOrder.ApplicationInstances,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.ApplicationResources,
    title: '应用资源',
    group: '应用管理',
    order: ResourcesOrder.ApplicationResources,
    actions: ['GET']
  },
  {
    resource: Resources.ApplicationRevisions,
    title: '应用实例历史记录',
    group: '应用管理',
    order: ResourcesOrder.ApplicationRevisions,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Applications,
    title: '应用',
    group: '应用管理',
    order: ResourcesOrder.Applications,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Connectors,
    title: '连接器',
    group: '运维中心',
    order: ResourcesOrder.Connectors,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Costs,
    title: '成本分析',
    group: '成本管理',
    order: ResourcesOrder.Costs,
    actions: ['POST']
  },
  {
    resource: Resources.Dashboards,
    title: '首页',
    group: '概览',
    order: ResourcesOrder.Dashboards,
    actions: ['POST', 'GET']
  },
  {
    resource: Resources.Environments,
    title: '环境',
    group: '运维中心',
    order: ResourcesOrder.Environments,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.ModuleCompletions,
    title: 'AI编写模块',
    group: '运维中心',
    order: ResourcesOrder.ModuleCompletions,
    actions: ['GET', 'POST']
  },
  {
    resource: Resources.ModuleVersions,
    title: '模块版本',
    group: '运维中心',
    order: ResourcesOrder.ModuleVersions,
    actions: ['GET']
  },
  {
    resource: Resources.Modules,
    title: '模块',
    group: '运维中心',
    order: ResourcesOrder.Modules,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Perspectives,
    title: '视图',
    group: '成本管理',
    order: ResourcesOrder.Perspectives,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Projects,
    title: '项目',
    group: '应用管理',
    order: ResourcesOrder.Projects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Roles,
    title: '角色',
    group: '系统设置',
    order: ResourcesOrder.Roles,
    actions: ['GET']
  },
  {
    resource: Resources.Secrets,
    title: '密钥',
    group: '运维中心',
    order: ResourcesOrder.Secrets,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Settings,
    title: '配置管理',
    group: '系统设置',
    order: ResourcesOrder.Settings,
    actions: ['GET', 'PUT']
  },
  {
    resource: Resources.SubjectRoles,
    title: '用户角色',
    group: '系统设置',
    order: ResourcesOrder.SubjectRoles,
    actions: ['GET', 'POST', 'DELETE']
  },
  {
    resource: Resources.Subjects,
    title: '用户管理',
    group: '系统设置',
    order: ResourcesOrder.Subjects,
    actions: ['GET', 'POST', 'DELETE']
  },
  {
    resource: Resources.Tokens,
    title: 'Tokens',
    order: 999,
    actions: ['GET', 'POST', 'DELETE']
  }
];
