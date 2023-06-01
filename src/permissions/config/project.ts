import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.ApplicationInstances,
    title: 'permission.resource.project.appInstance',
    group: Group.AppManagement,
    order: ResourcesOrder.ApplicationInstances,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  {
    resource: Resources.ApplicationResources,
    title: 'permission.resource.project.appResource',
    group: Group.AppManagement,
    order: ResourcesOrder.ApplicationResources,
    actions: ['GET']
  },
  {
    resource: Resources.ApplicationRevisions,
    title: 'permission.resource.project.appRevision',
    group: Group.AppManagement,
    order: ResourcesOrder.ApplicationRevisions,
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
    resource: Resources.Applications,
    title: 'permission.resource.project.appList',
    group: Group.AppManagement,
    order: ResourcesOrder.Applications,
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
