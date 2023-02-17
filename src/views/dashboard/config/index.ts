// issues summary bar
import { riskColorMap } from '@/config/global';

export const resourceIssueTypeConfig = [
  {
    name: 'dashboard.overview.repo',
    value: 11,
    key: 'repository',
    itemStyle: { color: '#206ccf' }
  },
  {
    name: 'dashboard.overview.image',
    value: 22,
    key: 'containerImage',
    itemStyle: { color: '#206ccf' }
  },
  {
    name: 'Kubernetes',
    value: 3,
    key: 'kubernetes',
    itemStyle: { color: '#206ccf' }
  },
  { name: 'SBOM', value: 1, key: 'sbom', itemStyle: { color: '#206ccf' } }
];

export const deployDataConfig = [
  {
    name: '成功',
    value: 20,
    key: 'high',
    label: { show: false },
    itemStyle: { color: 'rgba(159, 232, 219, 1)' }
  },
  {
    name: '失败',
    value: 8,
    key: 'medium',
    label: { show: false },
    itemStyle: { color: 'rgba(255, 197, 192, 1)' }
  },
  {
    name: '运行中',
    value: 3,
    key: 'low',
    label: { show: false },
    itemStyle: { color: 'rgba(163, 230, 245, 1)' }
  },
  {
    name: '审核中',
    value: 3,
    key: 'low',
    label: { show: false },
    itemStyle: { color: 'rgba(184, 218, 243, 1)' }
  }
];

export const issueTrendConfig = [
  {
    label: 'projects.risk.high',
    name: 'HighIssueCount',
    color: `rgb(${riskColorMap.high})`
  },
  {
    label: 'projects.risk.middle',
    name: 'MiddleIssueCount',
    color: `rgb(${riskColorMap.medium})`
  },
  {
    label: 'projects.risk.low',
    name: 'LowIssueCount',
    color: `rgb(${riskColorMap.low})`
  }
];
export const overViewConfig = [
  {
    label: 'Applications',
    value: 0,
    key: 'repository',
    color:
      'linear-gradient(rgba(159, 232, 219, 0.3) 0%, rgba(159, 232, 219, 0.4) 100%)'
  },
  {
    label: 'Services',
    value: 0,
    key: 'containerImage',
    color:
      'linear-gradient(rgba(255, 197, 192, 0.3) 0%, rgba(255, 197, 192, 0.4) 100%)'
  },
  {
    label: 'Instances',
    value: 0,
    key: 'kubernetes',
    color:
      'linear-gradient(rgba(184, 218, 243, 0.3) 0%, rgba(184, 218, 243, 0.4) 100%)'
  },
  {
    label: 'Connectors',
    value: 0,
    key: 'sbom',
    color:
      'linear-gradient(rgb(163 230 245 / 30%) 0%, rgb(163 230 245 / 40%) 100%)'
  }
];

export const statusColorMap = {
  running: 'rgba(163, 230, 245, 1)',
  auditing: 'rgba(184, 218, 243, 1)',
  failed: 'rgba(255, 197, 192, 1)',
  done: 'rgba(159, 232, 219, 1)'
};
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
  '#722ED1'
];
export const datePickerMode = [
  { label: 'dashboard.datepicker.day', value: 'day' },
  { label: 'dashboard.datepicker.month', value: 'month' },
  { label: 'dashboard.datepicker.year', value: 'year' }
];
export default {};
