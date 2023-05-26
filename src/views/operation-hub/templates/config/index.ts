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
  // { label: 'Resources', value: '', com: 'tabResource' },
  { label: 'Providers', value: '', com: 'tabConnector' }
];

export const actionList = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    requiredAuth: true,
    permission: ['PUT']
  },
  {
    label: 'common.button.refresh',
    value: 'refresh',
    icon: 'icon-refresh',
    requiredAuth: true,
    permission: ['PUT']
  }
];
export default {};
