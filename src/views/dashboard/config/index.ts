// issues summary bar
import { riskColorMap } from '@/config/global';
import dayjs from 'dayjs';

export const statusColorMap = {
  running: 'rgba(102, 201, 255,.8)',
  auditing: 'rgba(135, 145, 247, .5)',
  failed: 'rgba(255, 197, 192, 1)',
  succeed: 'rgba(159, 232, 219, 1)'
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
    name: 'dashboard.deployment.succeed',
    value: 0,
    key: 'succeed',
    label: { show: false },
    itemStyle: { color: statusColorMap.succeed }
  },
  {
    name: 'dashboard.deployment.failed',
    value: 0,
    key: 'failed',
    label: { show: false },
    itemStyle: { color: statusColorMap.failed }
  },
  {
    name: 'dashboard.deployment.running',
    value: 0,
    key: 'running',
    label: { show: false },
    itemStyle: { color: statusColorMap.running }
  }
  // {
  //   name: '审核中',
  //   value: 3,
  //   key: 'low',
  //   label: { show: false },
  //   itemStyle: { color: statusColorMap.auditing }
  // }
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
    label: 'dashboard.overview.applications',
    value: 0,
    key: 'application',
    color:
      'linear-gradient(rgba(159, 232, 219, 0.3) 0%, rgba(159, 232, 219, 0.4) 100%)'
  },

  {
    label: 'dashboard.overview.instance',
    value: 0,
    key: 'instance',
    // color:
    //   'linear-gradient(rgba(173, 209, 235, 0.3) 0%, rgba(173, 209, 235, 0.4) 100%)',
    color:
      'linear-gradient(rgba(184, 218, 243, 0.3) 0%, rgba(184, 218, 243, 0.4) 100%)'
  },
  {
    label: 'dashboard.overview.environment',
    value: 0,
    key: 'environment',
    // color:
    //   'linear-gradient(rgba(163, 216, 245, 0.3) 0%, rgba(163, 216, 245, 0.4) 100%)',
    color:
      'linear-gradient(rgba(255, 197, 192, 0.3) 0%, rgba(255, 197, 192, 0.4) 100%)'
  },
  {
    label: 'dashboard.overview.connector',
    value: 0,
    key: 'connector',
    color:
      'linear-gradient(rgb(163 230 245 / 30%) 0%, rgb(163 230 245 / 40%) 100%)'
  }
];
export const DateShortCuts = [
  {
    label: 'cost.analyse.datepicker.7days',
    unit: 'day',
    format: 'YYYY-MM-DD',
    timeControl: 'now-7d',
    value: [
      dayjs()
        .subtract(6, 'day')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DDTHH:mm:ss+00:00'),
      dayjs().subtract(0, 'day').format('YYYY-MM-DDTHH:mm:ss+00:00')
    ]
  },
  {
    label: 'cost.analyse.datepicker.30days',
    unit: 'day',
    format: 'YYYY-MM-DD',
    timeControl: 'now-30d',
    value: [
      dayjs()
        .subtract(29, 'day')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DDTHH:mm:ss+00:00'),
      dayjs().subtract(0, 'day').format('YYYY-MM-DDTHH:mm:ss+00:00')
    ]
  },
  {
    label: 'cost.analyse.datepicker.currentMonth',
    unit: 'day',
    format: 'YYYY-MM-DD',
    timeControl: 'now/M',
    value: [
      dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss+00:00'),
      dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00')
    ]
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
