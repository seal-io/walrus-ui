// resource that same with the api data
export enum Resources {
  ServiceResources = 'serviceResources',
  ServiceRevisions = 'serviceRevisions',
  Services = 'services',
  Connectors = 'connectors',
  Costs = 'costs',
  Dashboards = 'dashboards',
  Environments = 'environments',
  TemplateCompletions = 'templateCompletions',
  TemplateVersions = 'templateVersions',
  Templates = 'templates',
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
  ServiceResources = MenuOrder.ApplicationManagement,
  ServiceRevisions = MenuOrder.ApplicationManagement,
  Services = MenuOrder.ApplicationManagement,
  Connectors = MenuOrder.OperationHub,
  Costs = MenuOrder.CostManagement,
  Dashboards = MenuOrder.Dashboards,
  Environments = MenuOrder.OperationHub,
  TemplateCompletions = MenuOrder.OperationHub,
  TemplateVersions = MenuOrder.OperationHub,
  Templates = MenuOrder.OperationHub,
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
export enum Group {
  Dashboard = 'Dashboard',
  AppManagement = 'AppManagement',
  CostManagement = 'CostManagement',
  OperatorHub = 'OperatorHub',
  SystemSettings = 'SystemSettings'
}
export const GroupMap = {
  Dashboard: 'menu.dashboard',
  AppManagement: 'menu.applicationManagement',
  CostManagement: 'menu.costManagement',
  OperatorHub: 'menu.operatorHub',
  SystemSettings: 'menu.systemsettings'
};

export const ResourcesActionsDic = {
  [Resources.Dashboards]: {
    POST: 'GET',
    GET: 'GET'
  },
  [Resources.Costs]: {
    POST: 'GET'
  }
};

export default {};
