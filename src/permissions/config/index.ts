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
  Variables = 'variables',
  Settings = 'settings',
  ProjectSubjects = 'projectSubjects',
  Subjects = 'subjects',
  Tokens = 'tokens',
  Catalogs = 'catalogs'
}

const enum MenuOrder {
  Dashboards,
  ApplicationManagement,
  CostManagement,
  OperationHub,
  SystemSettings,
  SystemTokens,
  Subjects
}

// resource order according to the menu
export enum ResourcesOrder {
  ServiceResources = MenuOrder.ApplicationManagement,
  ServiceRevisions = MenuOrder.ApplicationManagement,
  Services = MenuOrder.ApplicationManagement,
  Environments = MenuOrder.ApplicationManagement,
  ProjectSubjects = MenuOrder.ApplicationManagement,
  Connectors = MenuOrder.OperationHub,
  Costs = MenuOrder.CostManagement,
  Dashboards = MenuOrder.Dashboards,
  TemplateCompletions = MenuOrder.OperationHub,
  TemplateVersions = MenuOrder.OperationHub,
  Templates = MenuOrder.OperationHub,
  Catalogs = MenuOrder.OperationHub,
  Perspectives = MenuOrder.CostManagement,
  Projects = MenuOrder.ApplicationManagement,
  Roles = MenuOrder.SystemSettings,
  Variables = MenuOrder.OperationHub,
  Settings = MenuOrder.SystemSettings,
  Subjects = MenuOrder.Subjects,
  Tokens = MenuOrder.SystemTokens
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

// group according to the menu
export enum Group {
  Dashboard = 'Dashboard',
  AppManagement = 'AppManagement',
  CostManagement = 'CostManagement',
  OperatorHub = 'OperatorHub',
  SystemSettings = 'SystemSettings',
  Subjects = 'Subjects'
}

// group title according to the menu
export const GroupMap = {
  Dashboard: 'menu.dashboard',
  AppManagement: 'menu.applicationManagement',
  CostManagement: 'menu.costManagement',
  OperatorHub: 'menu.operatorHub',
  SystemSettings: 'menu.systemsettings',
  Subjects: 'menu.subjects'
};

// some resource need to use post to get data
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
