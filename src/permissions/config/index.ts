// resource that same with the api data
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
