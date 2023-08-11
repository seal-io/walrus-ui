import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.Settings,
    title: 'permission.resource.system.operation.config',
    group: Group.SystemSettings,
    order: ResourcesOrder.Settings,
    actions: ['GET', 'PUT']
  },
  // {
  //   resource: Resources.SubjectRoles,
  //   title: 'permission.resource.system.operation.userRole',
  //   group: Group.SystemSettings,
  //   order: ResourcesOrder.SubjectRoles,
  //   actions: ['GET', 'POST', 'DELETE']
  // },
  {
    resource: Resources.Subjects,
    title: 'permission.resource.system.operation.userManagement',
    group: Group.Subjects,
    order: ResourcesOrder.Subjects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
  // {
  //   resource: Resources.Tokens,
  //   title: 'permission.resource.system.operation.token',
  //   group: Group.SystemSettings,
  //   order: ResourcesOrder.Tokens,
  //   actions: ['GET', 'POST', 'DELETE']
  // }
  // {
  //   resource: Resources.Roles,
  //   title: 'permission.resource.system.operation.role',
  //   group: Group.SystemSettings,
  //   order: ResourcesOrder.Roles,
  //   actions: ['GET']
  // }
];
