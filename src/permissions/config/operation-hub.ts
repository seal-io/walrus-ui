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
    resource: Resources.TemplateCompletions,
    title: 'permission.resource.system.operation.aiCode',
    group: Group.OperatorHub,
    order: ResourcesOrder.TemplateCompletions,
    actions: ['GET', 'POST']
  },
  {
    resource: Resources.Templates,
    title: 'permission.resource.system.operation.module',
    group: Group.OperatorHub,
    order: ResourcesOrder.Templates,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Catalogs,
    title: 'menu.operatorHub.catalog',
    group: Group.OperatorHub,
    order: ResourcesOrder.Catalogs,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Variables,
    title: 'permission.resource.system.operation.secret',
    group: Group.OperatorHub,
    order: ResourcesOrder.Variables,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
