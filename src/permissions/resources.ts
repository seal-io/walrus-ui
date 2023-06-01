import { Resources, Group, ResourcesOrder } from './config';
// resource config
import costManagement from './config/cost-management';
import dashboard from './config/dashboard';
import operationHub from './config/operation-hub';
import project from './config/project';
import systemSettings from './config/system-settings';

export const ProjectPermissionResource = [...project];
// resource actions
export default [
  ...dashboard,
  ...project.filter((item) => {
    return (
      item.resource !== Resources.SubjectRoles &&
      item.resource !== Resources.Secrets
    );
  }),
  {
    resource: Resources.Secrets,
    title: 'permission.resource.system.operation.secret',
    group: Group.OperatorHub,
    order: ResourcesOrder.Secrets,
    actions: ['GET', 'POST', 'DELETE', 'PUT']
  },
  ...costManagement,
  ...operationHub,
  ...systemSettings
];
