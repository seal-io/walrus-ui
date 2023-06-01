import { Resources, Group, ResourcesOrder } from './index';

export default [
  {
    resource: Resources.Costs,
    title: 'permission.resource.system.costManagement.costAnalyse',
    group: Group.CostManagement,
    order: ResourcesOrder.Costs,
    actions: ['POST']
  },
  {
    resource: Resources.Perspectives,
    title: 'permission.resource.system.costManagement.perspective',
    group: Group.CostManagement,
    order: ResourcesOrder.Perspectives,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  }
];
