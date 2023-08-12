import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.Settings,
    title: 'permission.resource.system.operation.config',
    group: Group.SystemSettings,
    order: ResourcesOrder.Settings,
    actions: ['GET', 'PUT']
  },

  {
    resource: Resources.Subjects,
    title: 'permission.resource.system.operation.userManagement',
    group: Group.Subjects,
    order: ResourcesOrder.Subjects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
