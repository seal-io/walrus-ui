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
  ...project,
  ...costManagement,
  ...operationHub,
  ...systemSettings
];
