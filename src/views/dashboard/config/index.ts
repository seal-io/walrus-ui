// issues summary bar
import { riskColorMap } from '@/config/global';

export const resourceIssueTypeConfig = [
  {
    name: 'dashboard.overview.repo',
    value: 11,
    key: 'repository',
    itemStyle: { color: '#206ccf' },
  },
  {
    name: 'dashboard.overview.image',
    value: 22,
    key: 'containerImage',
    itemStyle: { color: '#206ccf' },
  },
  {
    name: 'Kubernetes',
    value: 3,
    key: 'kubernetes',
    itemStyle: { color: '#206ccf' },
  },
  { name: 'SBOM', value: 1, key: 'sbom', itemStyle: { color: '#206ccf' } },
];

export const severityDataConfig = [
  {
    name: 'projects.risk.high',
    value: 20,
    key: 'high',
    label: { show: false },
    itemStyle: { color: `rgba(${riskColorMap.high},.8)` },
  },
  {
    name: 'projects.risk.middle',
    value: 8,
    key: 'medium',
    label: { show: false },
    itemStyle: { color: `rgba(${riskColorMap.medium},.8)` },
  },
  {
    name: 'projects.risk.low',
    value: 3,
    key: 'low',
    label: { show: false },
    itemStyle: { color: `rgba(${riskColorMap.low},.8)` },
  },
];

export const issueTypeDataConfig = [
  {
    name: 'dashboard.issue.vuln',
    value: 10,
    key: 'vulnerability',
    label: { show: false },
    itemStyle: { color: '#206CCF' },
  },
  {
    name: 'dashboard.issue.license',
    value: 15,
    key: 'license',
    label: { show: false },
    itemStyle: { color: '#00A3EC' },
  },
  {
    name: 'dashboard.issue.config',
    value: 9,
    key: 'configuration',
    label: { show: false },
    itemStyle: { color: '#00D2E3' },
  },
  {
    name: 'dashboard.issue.other',
    value: 20,
    key: 'other',
    label: { show: false },
    itemStyle: { color: '#6FFACB' },
  },
];
export const issueTrendConfig = [
  {
    label: 'projects.risk.high',
    name: 'HighIssueCount',
    color: `rgb(${riskColorMap.high})`,
  },
  {
    label: 'projects.risk.middle',
    name: 'MiddleIssueCount',
    color: `rgb(${riskColorMap.medium})`,
  },
  {
    label: 'projects.risk.low',
    name: 'LowIssueCount',
    color: `rgb(${riskColorMap.low})`,
  },
];
export const overViewConfig = [
  {
    label: 'dashboard.overview.repo',
    value: 0,
    provider: 'repo',
    key: 'repository',
  },
  {
    label: 'dashboard.overview.image',
    value: 0,
    provider: 'oci',
    key: 'containerImage',
  },
  {
    label: 'dashboard.overview.kubernetes',
    value: 0,
    provider: 'kubernetes',
    key: 'kubernetes',
  },
  {
    label: 'dashboard.overview.sbom',
    value: 0,
    provider: 'uploaded',
    key: 'sbom',
  },
];
export const overViewComponentConfig = [
  {
    label: 'dashboard.overview.policy',
    value: 0,
    provider: 'policy',
    key: 'policy',
  },
  {
    label: 'dashboard.overview.componentVersion',
    value: 0,
    provider: 'version',
    key: 'package',
  },
  // {
  //   label: 'dashboard.overview.componentDeps',
  //   value: 0,
  //   provider: 'deps',
  //   key: 'package',
  // },
  {
    label: 'dashboard.overview.license',
    value: 0,
    provider: 'license',
    key: 'license',
  },
];
export const colorList = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#722ED1',
];
export const datePickerMode = [
  { label: 'dashboard.datepicker.day', value: 'day' },
  { label: 'dashboard.datepicker.month', value: 'month' },
  { label: 'dashboard.datepicker.year', value: 'year' },
];
export default {};
