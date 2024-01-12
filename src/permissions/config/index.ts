// resource that same with the api data
export enum Resources {
  ResourceComponents = 'resourceComponents',
  ResourceRevisions = 'resourceRevisions',
  Resources = 'resources',
  Connectors = 'connectors',
  ResourceDefinitions = 'resourceDefinitions',
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
  Catalogs = 'catalogs',
  Workflows = 'workflows',
  WorkflowExecutions = 'workflowExecutions',
  WorkflowStageExecutions = 'workflowStageExecutions',
  WorkflowStepExecutions = 'workflowStepExecutions',
  WorkflowApply = '/v1/projects/:project/workflows/:workflow/run',
  WorkflowResubmit = '/v1/projects/:project/workflows/:workflow/executions/:workflowexecution/rerun'
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
  ResourceComponents = MenuOrder.ApplicationManagement,
  ResourceRevisions = MenuOrder.ApplicationManagement,
  Resources = MenuOrder.ApplicationManagement,
  Environments = MenuOrder.ApplicationManagement,
  ProjectSubjects = MenuOrder.ApplicationManagement,
  Connectors = MenuOrder.OperationHub,
  Costs = MenuOrder.CostManagement,
  Dashboards = MenuOrder.Dashboards,
  TemplateCompletions = MenuOrder.OperationHub,
  TemplateVersions = MenuOrder.OperationHub,
  Templates = MenuOrder.OperationHub,
  Catalogs = MenuOrder.OperationHub,
  ResourceDefinitions = MenuOrder.OperationHub,
  Perspectives = MenuOrder.CostManagement,
  Projects = MenuOrder.ApplicationManagement,
  Roles = MenuOrder.SystemSettings,
  Variables = MenuOrder.OperationHub,
  Settings = MenuOrder.SystemSettings,
  Subjects = MenuOrder.Subjects,
  Tokens = MenuOrder.SystemTokens,
  Workflows = MenuOrder.ApplicationManagement,
  WorkflowExecutions = MenuOrder.ApplicationManagement,
  WorkflowStageExecutions = MenuOrder.ApplicationManagement,
  WorkflowStepExecutions = MenuOrder.ApplicationManagement
}

// project resource order
export enum ProjectResourcesOrder {
  Projects,
  Environments,
  Workflows,
  Variables,
  Templates,
  Catalogs,
  Connectors,
  ProjectSubjects,
  Resources,
  ResourceRevisions,
  ResourceComponents
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

export const ReadonlyActions = [Actions.GET];

export const UpdateActions = [
  Actions.PUT,
  Actions.POST,
  Actions.DELETE,
  Actions.All
];

// group according to the menu, not Resource
export enum Group {
  Dashboard = 'Dashboard',
  AppManagement = 'AppManagement',
  CostManagement = 'CostManagement',
  OperatorHub = 'OperatorHub',
  SystemSettings = 'SystemSettings',
  Subjects = 'Subjects'
}

// group title according to the menu, not Resource
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
