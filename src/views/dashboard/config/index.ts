// issues summary bar
import dayjs from 'dayjs';

export const statusColorMap = {
  running: 'rgba(247, 186, 30,1)',
  auditing: 'rgba(135, 145, 247, .5)',
  failed: 'rgba(245, 63, 63,.7)',
  succeed: 'rgba(128, 212, 197, 1)',
  succeeded: 'rgba(128, 212, 197, 1)'
};
export const chartStatusColorMap = {
  running: 'rgba(247, 186, 30,.5)',
  auditing: 'rgba(135, 145, 247, .5)',
  failed: 'rgba(245, 63, 63,.5)',
  succeed: 'rgba(128, 212, 197, .8)',
  succeeded: 'rgba(128, 212, 197, .8)'
};

export const deployDataConfig = [
  {
    name: 'dashboard.deployment.succeed',
    value: 0,
    key: 'succeeded',
    label: { show: false },
    itemStyle: { color: chartStatusColorMap.succeed }
  },
  {
    name: 'dashboard.deployment.failed',
    value: 0,
    key: 'failed',
    label: { show: false },
    itemStyle: { color: chartStatusColorMap.failed }
  },
  {
    name: 'dashboard.deployment.running',
    value: 0,
    key: 'running',
    label: { show: false },
    itemStyle: { color: chartStatusColorMap.running }
  }
  // {
  //   name: '审核中',
  //   value: 3,
  //   key: 'low',
  //   label: { show: false },
  //   itemStyle: { color: statusColorMap.auditing }
  // }
];

export const overViewConfig = [
  {
    label: 'menu.applicationManagement.project',
    value: 0,
    key: 'project',
    color:
      'linear-gradient(rgba(159, 232, 219, 0.3) 0%, rgba(159, 232, 219, 0.4) 100%)'
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
  // {
  //   label: 'menu.applicationManagement.services',
  //   value: 0,
  //   key: 'service',
  //   // color:
  //   //   'linear-gradient(rgba(173, 209, 235, 0.3) 0%, rgba(173, 209, 235, 0.4) 100%)',
  //   color:
  //     'linear-gradient(rgba(184, 218, 243, 0.3) 0%, rgba(184, 218, 243, 0.4) 100%)'
  // },
  {
    label: 'menu.applicationManagement.resource',
    value: 0,
    key: 'resource',
    // color:
    //   'linear-gradient(rgba(173, 209, 235, 0.3) 0%, rgba(173, 209, 235, 0.4) 100%)',
    color:
      'linear-gradient(rgba(184, 218, 243, 0.3) 0%, rgba(184, 218, 243, 0.4) 100%)'
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
      dayjs().hour(0).minute(0).second(0).format('YYYY-MM-01THH:mm:ss+00:00'),
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
