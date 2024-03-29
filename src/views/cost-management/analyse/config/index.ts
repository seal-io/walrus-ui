import dayjs from 'dayjs';
import _, { find, round, get } from 'lodash';
import { useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import { MoreAction } from '@/views/config/interface';

const userStore = useUserStore();

export const relationOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
];
export const operatorList = [
  { label: 'In', value: 'in' },
  { label: 'Not In', value: 'notin' }
];
export const dateFormatMap = {
  day: 'YYYY.MM.DD',
  week: 'YYYY.MM.DD',
  month: 'YYYY.MM',
  year: 'YYYY'
};
export const costShareMode = [
  {
    label: 'cost.optimize.form.share.avg',
    name: 'Equally split',
    value: 'equally'
  },
  {
    label: 'cost.optimize.form.share.ratio',
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
      dayjs().hour(0).minute(0).second(0).format('YYYY-MM-01THH:mm:ss+00:00'),
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
    label: 'cost.analyse.detail.totalCost',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.projects',
    key: 'projectCount',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.clusters',
    key: 'clusterCount',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  }
];

export const projectCostOverview = [
  {
    label: 'cost.analyse.detail.totalCost',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.daily',
    key: 'averageDailyCost',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  }
];
export const resourceCostOverview = [
  { label: '节点数', key: '', value: 9, color: '#0F8584' },
  { label: 'CPU', key: '', value: 12, color: '#7AB6B5' },
  { label: 'Memory', key: '', value: 23, color: '#324B4B' },
  { label: 'Pods', key: '', value: 23, color: '#324B4B' }
];
export const clusterCostOverview = [
  {
    label: 'cost.analyse.detail.allCost',
    key: 'totalCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.dailyCost',
    key: 'averageDailyCost',
    value: 0,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.loadCost',
    key: 'itemCost',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.mngCost',
    key: 'managementCost',
    value: 0,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: 'cost.analyse.detail.idleCost',
    key: 'idleCost',
    value: 0,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  }
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
    title: 'cost.analyse.table.date'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];
export const costPerProjectCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: 'cost.analyse.detail.project'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];
export const costPerClusterCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: 'cost.analyse.detail.cluster'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];

export const clusterNamespaceCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: 'cost.optimize.form.name'
  },
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
    title: 'cost.analyse.table.ram'
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
    dataIndex: 'loadBalancerCost',
    render({ record }) {
      return round(record.loadBalancerCost, 4) || 0;
    },
    title: 'cost.analyse.table.loadbalance'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'sharedCost',
    render({ record }) {
      return round(record.sharedCost, 4) || 0;
    },
    title: 'cost.analyse.table.shareCost'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];

export const projectCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'itemName',
    title: 'cost.analyse.table.application'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];
export const costTableCols = [
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
    title: 'cost.analyse.table.ram'
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
    dataIndex: 'loadBalancerCost',
    render({ record }) {
      return round(record.loadBalancerCost, 4) || 0;
    },
    title: 'cost.analyse.table.loadbalance'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'sharedCost',
    render({ record }) {
      return round(record.sharedCost, 4) || 0;
    },
    title: 'cost.analyse.table.shareCost'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'totalCost',
    render({ record }) {
      return round(record.totalCost, 4) || 0;
    },
    title: 'cost.analyse.detail.totalCost'
  }
];
export const builtinViewMap = {
  all: 'cost.optimize.table.all',
  project: 'cost.optimize.table.project',
  cluster: 'cost.optimize.table.cluster'
};

export const builtinViewList = ['ALL', 'Cluster', 'Project'];
export const builtinList = ['All', 'Cluster', 'Project'];

export const VIEW_MAP = {
  all: 'all',
  custom: 'custom'
};

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFun({ itemInfo }) {
      return (
        userStore.hasRolesActionsPermission({
          resource: Resources.Costs,
          actions: [Actions.PUT]
        }) && !_.includes(builtinList, itemInfo.name)
      );
    }
  },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger',
    filterFun({ itemInfo }) {
      return (
        userStore.hasRolesActionsPermission({
          resource: Resources.Costs,
          actions: [Actions.DELETE]
        }) && !_.includes(builtinList, itemInfo.name)
      );
    }
  }
];
export default {};
