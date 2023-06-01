import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.Connectors,
    title: 'permission.resource.system.operation.connector',
    group: Group.OperatorHub,
    order: ResourcesOrder.Connectors,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Environments,
    title: 'permission.resource.system.operation.enviroment',
    group: Group.OperatorHub,
    order: ResourcesOrder.Environments,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.ModuleCompletions,
    title: 'permission.resource.system.operation.aiCode',
    group: Group.OperatorHub,
    order: ResourcesOrder.ModuleCompletions,
    actions: ['GET', 'POST']
  },
  {
    resource: Resources.ModuleVersions,
    title: 'permission.resource.system.operation.moduleVersion',
    group: Group.OperatorHub,
    order: ResourcesOrder.ModuleVersions,
    actions: ['GET']
  },
  {
    resource: Resources.Modules,
    title: 'permission.resource.system.operation.module',
    group: Group.OperatorHub,
    order: ResourcesOrder.Modules,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Secrets,
    title: 'permission.resource.system.operation.secret',
    group: Group.OperatorHub,
    order: ResourcesOrder.Secrets,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
