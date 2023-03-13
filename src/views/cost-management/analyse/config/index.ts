import dayjs from 'dayjs';
import { find, round, get } from 'lodash';

export const relationOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
];
export const operatorList = [
  { label: 'In', value: 'in' },
  { label: 'Not In', value: 'notin' }
];

export const costShareMode = [
  // { label: '展示', name: 'Show', value: 'show' },
  { label: '平均分摊', name: 'Equally split', value: 'equally' },
  {
    label: '基于成本比例分摊',
    name: 'Proportionally split',
    value: 'proportionally'
  }
];
export const timeRangeOptions = [
  { label: 'cost.analyse.datepicker.7days', value: 'now-7d' },
  { label: 'cost.analyse.datepicker.30days', value: 'now-30d' },
  { label: 'cost.analyse.datepicker.currentMonth', value: 'now/M' }
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

export const getTimeRange = (val) => {
  const data = find(DateShortCuts, (item) => item.timeControl === val);
  return data
    ? get(data, 'value')
    : [
        dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss+00:00'),
        dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00')
      ];
};

export const setEndTimeAddDay = (time, mode) => {
  if (mode === 'utc') {
    return dayjs(time).add(1, 'day').format('YYYY-MM-DDT00:00:00+00:00');
  }
  return dayjs(time).hour(0).minute(0).second(0).add(1, 'day').format();
};
export const costOverview = [
  {
    label: '总消费',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: '项目数',
    key: 'projectCount',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  },
  {
    label: '集群数',
    key: 'clusterCount',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  }
];

export const projectCostOverview = [
  {
    label: '当月消费',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: '日均消费',
    key: 'averageDailyCost',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  }
  // {
  //   label: '可优化费用',
  //   key: 'currency',
  //   value: 0,
  //   color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  // }
];
export const resourceCostOverview = [
  { label: '节点数', key: '', value: 9, color: '#0F8584' },
  { label: 'CPU', key: '', value: 12, color: '#7AB6B5' },
  { label: 'Memory', key: '', value: 23, color: '#324B4B' },
  { label: 'Pods', key: '', value: 23, color: '#324B4B' }
];
export const clusterCostOverview = [
  {
    label: '总费用',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: '日均消费',
    key: 'averageDailyCost',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  },
  {
    label: '工作负载费用',
    key: 'allocationCost',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  },
  {
    label: '管理费用',
    key: 'managementCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: '空闲费用',
    key: 'idleCost',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  }
  // { label: '可优化费用', key: '', value: 0, color: '#324B4B' }
];
export const dailyCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    render({ record }) {
      return dayjs(record.itemName).format('YYYY-MM-DD');
    },
    title: '日期'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: '消费金额'
  }
];
export const costPerProjectCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: '项目'
  },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'count',
  //   title: '应用数'
  // },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: '消费金额'
  }
];
export const costPerClusterCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: '集群'
  },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'region',
  //   title: '区域'
  // },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'nodes',
  //   title: '节点数'
  // },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: '消费金额'
  }
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'status',
  //   title: '状态'
  // }
];

export const clusterNamespaceCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: '名称'
  },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'namespace',
  //   title: 'Namespace'
  // },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'pods',
  //   title: 'Pods',
  //   showIn: 'workload'
  // },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpuCost',
    render({ record }) {
      return round(record.cpuCost, 4) || 0;
    },
    title: 'CPU'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'ramCost',
    render({ record }) {
      return round(record.ramCost, 4) || 0;
    },
    title: '内存'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'pvCost',
    render({ record }) {
      return round(record.pvCost, 4) || 0;
    },
    title: 'PV'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'sharedCost',
    render({ record }) {
      return round(record.sharedCost, 4) || 0;
    },
    title: '共享资源费用'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: '消费金额'
  }
];

export const projectCostCols = [
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'itemName',
  //   title: '名称'
  // },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: '应用'
  },
  // {
  //   ellipsis: true,
  //   tooltip: true,
  //   cellStyle: { minWidth: '40px' },
  //   dataIndex: 'startTime',
  //   render({ record }) {
  //     return dayjs(record.startTime).format('YYYY-MM-DD');
  //   },
  //   title: '日期'
  // },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: '消费金额'
  }
];

export const builtinViewMap = {
  all: '所有资源',
  project: '项目',
  cluster: '集群'
};
export default {};
