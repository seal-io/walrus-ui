export const variableTypeList = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'bool', value: 'bool' },
  { label: 'object', value: 'object' }
];

export const SelectorAction = [
  { label: '项目名称', value: 'projectName' },
  { label: '环境名称', value: 'environmentName' },
  { label: 'applications.environment.type', value: 'environmentType' },
  { label: '环境标签', value: 'environmentLabels' },
  { label: '资源标签', value: 'resourceLabels' }
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
