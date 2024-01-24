import { useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import _ from 'lodash';
import { DefinitionDetailTabs, QAlinkMap } from '@/views/config';
import { MoreAction } from '@/views/config/interface';

const userStore = useUserStore();
export const variableTypeList = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'bool', value: 'bool' },
  { label: 'object', value: 'object' }
];

export const SelectorAction = [
  { label: 'resource.definition.detail.projectName', value: 'projectNames' },
  { label: 'resource.definition.detail.projectTag', value: 'projectLabels' },
  { label: 'resource.definition.detail.envName', value: 'environmentNames' },
  { label: 'applications.environment.type', value: 'environmentTypes' },
  { label: 'resource.definition.detail.envTag', value: 'environmentLabels' },
  { label: 'resource.definition.detail.resourceTag', value: 'resourceLabels' }
];

export const tabList = [
  {
    label: 'operation.templates.detail.inputs',
    value: DefinitionDetailTabs.INPUTS,
    com: 'tabInput'
  },
  {
    label: 'operation.templates.detail.outputs',
    value: DefinitionDetailTabs.OUTPUTS,
    com: 'tabOutput'
  },
  {
    label: 'operation.templates.detail.variableConfig',
    icon: '',
    value: DefinitionDetailTabs.UISCHEMA,
    com: 'tabEditSchema'
  }
];

export const definitionHelps = [
  {
    title: 'resource.definition.list.name',
    type: 'definiton',
    links: QAlinkMap.Definition,
    texts: [{ value: 'resource.definition.detail.helps.definition' }]
  }
];

export const definitionSchemaHelps = [
  {
    title: 'UI Schema',
    type: 'schema',
    links: QAlinkMap.DefinitionSchema,
    texts: [{ value: 'resource.definition.detail.helps.definitionSchema' }]
  }
];

export const schemaHelps = [
  {
    title: 'UI Schema',
    type: 'schema',
    links: QAlinkMap.UISchema,
    texts: [{ value: 'resource.definition.detail.helps.uischema' }]
  }
];
export const schemaActionList: any[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal'
  },
  {
    label: '同步 schema',
    value: 'refresh',
    icon: 'icon-sync',
    status: 'normal'
  }
];

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFun(itemInfo: any) {
      return (
        userStore.hasRolesActionsPermission({
          resource: Resources.ResourceDefinitions,
          actions: [Actions.PUT]
        }) && !itemInfo?.builtin
      );
    }
  },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger',
    filterFun(itemInfo) {
      return (
        userStore.hasRolesActionsPermission({
          resource: Resources.ResourceDefinitions,
          actions: [Actions.DELETE]
        }) &&
        (userStore.userSetting?.EnableBuiltinCatalog?.value === 'false' ||
          !itemInfo?.builtin)
      );
    }
  }
];
export default {};
