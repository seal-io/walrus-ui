import { MoreAction } from '@/views/config/interface';
import { useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import _ from 'lodash';

const userStore = useUserStore();
export const ScopeList = [
  { label: '包含全局', value: 'withGlobal' },
  { label: '包含项目', value: 'withProject' }
];

export const VariableScope = {
  ENVIRONMENT: 'Environment',
  PROJECT: 'Project',
  SYSTEM: 'System',
  SERVICE: 'Service'
};

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFun({ itemInfo, projectID }) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Variables,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Variables,
            actions: [Actions.PUT]
          });
    }
  },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger',
    filterFun({ itemInfo, projectID }) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Variables,
            projectID,
            actions: [Actions.DELETE]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Variables,
            actions: [Actions.DELETE]
          });
    }
  }
];
export default {};
