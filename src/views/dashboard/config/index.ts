// issues summary bar
import { riskColorMap } from '@/config/global';

export const statusColorMap = {
  running: 'rgba(102, 201, 255,.8)',
  auditing: 'rgba(135, 145, 247, .5)',
  failed: 'rgba(255, 197, 192, 1)',
  done: 'rgba(159, 232, 219, 1)'
};

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
    itemStyle: { color: statusColorMap.done }
  },
  {
    name: '失败',
    value: 8,
    key: 'medium',
    label: { show: false },
    itemStyle: { color: statusColorMap.failed }
  },
  {
    name: '运行中',
    value: 3,
    key: 'low',
    label: { show: false },
    itemStyle: { color: statusColorMap.running }
  },
  {
    name: '审核中',
    value: 3,
    key: 'low',
    label: { show: false },
    itemStyle: { color: statusColorMap.auditing }
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
    // color:
    //   'linear-gradient(rgba(163, 216, 245, 0.3) 0%, rgba(163, 216, 245, 0.4) 100%)',
    color:
      'linear-gradient(rgba(255, 197, 192, 0.3) 0%, rgba(255, 197, 192, 0.4) 100%)'
  },
  {
    label: 'Instances',
    value: 0,
    key: 'kubernetes',
    // color:
    //   'linear-gradient(rgba(173, 209, 235, 0.3) 0%, rgba(173, 209, 235, 0.4) 100%)',
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

export const colorList = [
  'rgba(84,112,198,.5)',
  'rgb(145 204 117 / 50%)',
  'rgb(250 200 88 / 50%)',
  'rgb(238 102 102 / 50%)',
  'rgb(115 192 222 / 50%)',
  'rgb(59 162 114 / 50%)',
  'rgb(252 132 82 / 50%)',
  'rgb(154 96 180 / 50%)',
  'rgb(234 124 204 / 50%)',
  'rgb(114 46 209 / 50%)'
];
export const datePickerMode = [
  { label: 'dashboard.datepicker.day', value: 'day' },
  { label: 'dashboard.datepicker.month', value: 'month' },
  { label: 'dashboard.datepicker.year', value: 'year' }
];
export default {};
