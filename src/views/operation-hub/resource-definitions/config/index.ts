export const variableTypeList = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'bool', value: 'bool' },
  { label: 'object', value: 'object' }
];

export const SelectorAction = [
  { label: 'resource.definition.detail.projectName', value: 'projectName' },
  { label: 'resource.definition.detail.envName', value: 'environmentName' },
  { label: 'applications.environment.type', value: 'environmentType' },
  { label: 'resource.definition.detail.envTag', value: 'environmentLabels' },
  { label: 'resource.definition.detail.resourceTag', value: 'resourceLabels' }
];

export const tabList = [
  { label: 'operation.templates.detail.inputs', value: '', com: 'tabInput' },
  { label: 'operation.templates.detail.outputs', value: '', com: 'tabOutput' },
  {
    label: 'operation.templates.detail.variableConfig',
    icon: '',
    value: '',
    com: 'tabEditSchema'
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
export default {};
