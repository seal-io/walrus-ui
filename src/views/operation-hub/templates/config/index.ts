import { useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import _ from 'lodash';
import { MoreAction } from '@/views/config/interface';

const userStore = useUserStore();

export const templateTypeList = [
  { value: 'mysql', desc: '', label: 'MySQL' },
  { value: 'webservice', desc: '', label: 'WebService' },
  { value: 'alicloud', desc: '', label: 'AliCloud' },
  { value: 'springboot', desc: '', label: 'SpringBoot' },
  { value: 'golang', desc: '', label: 'Golang' },
  { value: 'java', desc: '', label: 'Java' },
  { value: 'nodejs', desc: '', label: 'NodeJS' },
  { value: 'redis', desc: '', label: 'Redis' }
];
export const tabList = [
  { label: 'operation.templates.detail.reademe', value: '', com: 'tabReadme' },
  { label: 'operation.templates.detail.inputs', value: '', com: 'tabInput' },
  { label: 'operation.templates.detail.outputs', value: '', com: 'tabOutput' },
  { label: 'Providers', value: '', com: 'tabConnector' },
  {
    label: 'operation.templates.detail.variableConfig',
    icon: '',
    value: '',
    com: 'tabEditSchema'
  }
];

export const schemaActionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFun({ projectID }) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.TemplateVersions,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.TemplateVersions,
            actions: [Actions.PUT]
          });
    }
  },
  {
    label: 'common.button.resetdefault',
    value: 'reset',
    icon: 'icon-sync',
    status: 'normal',
    filterFun({ projectID }) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.TemplateVersions,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.TemplateVersions,
            actions: [Actions.PUT]
          });
    }
  }
];
export const actionList = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFunc(itemInfo, projectID) {
      if (_.get(itemInfo, 'catalog.id')) return false;
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Templates,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Templates,
            actions: [Actions.PUT]
          });
    },
    permission: ['PUT']
  },
  {
    label: 'common.button.refresh',
    value: 'refresh',
    icon: 'icon-refresh',
    status: 'normal',
    requiredAuth: true,
    filterFunc(itemInfo, projectID) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Templates,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Templates,
            actions: [Actions.PUT]
          });
    },
    permission: ['PUT']
  },
  {
    label: 'operation.templates.button.useInservice',
    value: 'useInService',
    icon: 'icon-shandian',
    iconfont: true,
    status: 'normal',
    requiredAuth: true,
    filterFunc(itemInfo, projectID) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Templates,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Templates,
            actions: [Actions.PUT]
          });
    },
    permission: ['PUT']
  }
];
export default {};
