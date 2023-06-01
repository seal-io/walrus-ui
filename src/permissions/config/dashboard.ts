import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.Dashboards,
    title: 'permission.resource.system.dashboard',
    group: Group.Dashboard,
    order: ResourcesOrder.Dashboards,
    actions: ['POST', 'GET']
  }
];
