import {
  Resources,
  Group,
  ResourcesOrder,
  ProjectResourcesOrder
} from './index';

export default [
  {
    resource: Resources.ResourceRevisions,
    title: 'permission.resource.project.appRevision',
    group: Group.AppManagement,
    order: ResourcesOrder.ResourceRevisions,
    resourceOrder: ProjectResourcesOrder.ResourceRevisions,
    actions: ['GET', 'DELETE']
  },
  {
    resource: Resources.ProjectSubjects,
    title: 'permission.resource.project.roleAuth',
    group: Group.AppManagement,
    order: ResourcesOrder.ProjectSubjects,
    resourceOrder: ProjectResourcesOrder.ProjectSubjects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Variables,
    title: 'permission.resource.project.secret',
    group: Group.OperatorHub,
    order: ResourcesOrder.Variables,
    resourceOrder: ProjectResourcesOrder.Variables,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Resources,
    title: 'permission.resource.project.appList',
    group: Group.AppManagement,
    order: ResourcesOrder.Resources,
    resourceOrder: ProjectResourcesOrder.Resources,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Projects,
    title: 'permission.button.action',
    group: Group.AppManagement,
    order: ResourcesOrder.Projects,
    resourceOrder: ProjectResourcesOrder.Projects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Connectors,
    title: 'permission.resource.system.operation.connector',
    group: Group.OperatorHub,
    order: ResourcesOrder.Connectors,
    resourceOrder: ProjectResourcesOrder.Connectors,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Templates,
    title: 'permission.resource.system.operation.module',
    group: Group.OperatorHub,
    order: ResourcesOrder.Templates,
    resourceOrder: ProjectResourcesOrder.Templates,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Catalogs,
    title: 'menu.operatorHub.catalog',
    group: Group.OperatorHub,
    order: ResourcesOrder.Catalogs,
    resourceOrder: ProjectResourcesOrder.Catalogs,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Environments,
    title: 'menu.operatorHub.evniroment',
    group: Group.AppManagement,
    order: ResourcesOrder.Environments,
    resourceOrder: ProjectResourcesOrder.Environments,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Workflows,
    title: 'menu.applicationManagement.workflow',
    group: Group.AppManagement,
    order: ResourcesOrder.Workflows,
    resourceOrder: ProjectResourcesOrder.Workflows,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
