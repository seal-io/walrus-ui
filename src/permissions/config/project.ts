import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.ServiceResources,
    title: 'permission.resource.project.appResource',
    group: Group.AppManagement,
    order: ResourcesOrder.ServiceResources,
    actions: ['GET']
  },
  {
    resource: Resources.ServiceRevisions,
    title: 'permission.resource.project.appRevision',
    group: Group.AppManagement,
    order: ResourcesOrder.ServiceRevisions,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.SubjectRoles,
    title: 'permission.resource.project.roleAuth',
    group: Group.SystemSettings,
    order: ResourcesOrder.SubjectRoles,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Secrets,
    title: 'permission.resource.project.secret',
    group: Group.OperatorHub,
    order: ResourcesOrder.Secrets,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Services,
    title: 'permission.resource.project.appList',
    group: Group.AppManagement,
    order: ResourcesOrder.Services,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.Projects,
    title: 'permission.resource.project.project',
    group: Group.AppManagement,
    order: ResourcesOrder.Projects,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
