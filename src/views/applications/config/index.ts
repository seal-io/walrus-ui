export const issueTabList = [
  {
    label: 'applications.detail.tab.resource',
    value: 'resource',
    component: 'TabResource',
  },
  {
    label: 'projects.resource.tabfix.violation',
    value: 'issue',
    component: 'TabViolation',
  },
  {
    label: 'projects.history.table.components',
    value: 'component',
    component: 'TabComponent',
  },
];

export const basicConfig = [
  { label: 'applications.detail.basic.app', value: '', key: 'name', span: 1 },
  {
    label: 'applications.detail.basic.desc',
    value: '',
    key: 'description',
    span: 1,
  },
  {
    label: 'applications.detail.basic.createTime',
    value: '',
    key: 'createTime',
    span: 1,
  },
];
export default {};
