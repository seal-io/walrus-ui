export const relationOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' }
];
export const operatorList = [
  { label: 'In', value: 'in' },
  { label: 'Not In', value: 'NotIn' }
];

export const costShareMode = [
  { label: 'Show', value: 'show' },
  { label: 'Equally split', value: 'equally' },
  { label: 'Proportionally split', value: 'proportionally' }
];

export const costOverview = [
  {
    label: 'Spend Total',
    key: '',
    value: 9,
    color: 'linear-gradient(rgba(159,232,219,.3) 0%,rgba(159,232,219,.4) 100%)'
  },
  {
    label: 'Total Projects',
    key: '',
    value: 12,
    color: 'linear-gradient(rgba(255,197,192,.3) 0%,rgba(255,197,192,.4) 100%)'
  },
  {
    label: 'Total Kubernetes Cluster',
    key: '',
    value: 23,
    color: 'linear-gradient(rgba(184,218,243,.3) 0%,rgba(184,218,243,.4) 100%)'
  }
];

export const resourceCostOverview = [
  { label: '节点数', key: '', value: 9, color: '#0F8584' },
  { label: 'CPU', key: '', value: 12, color: '#7AB6B5' },
  { label: 'Memory', key: '', value: 23, color: '#324B4B' },
  { label: 'Pods', key: '', value: 23, color: '#324B4B' }
];
export const clusterCostOverview = [
  { label: '当前消费', key: '', value: 9, color: '#0F8584' },
  { label: '日均消费', key: '', value: 12, color: '#7AB6B5' },
  { label: '可优化费用', key: '', value: 23, color: '#324B4B' }
];
export const dailyCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'time',
    title: '日期'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'spend',
    title: '消费金额'
  }
];
export const costPerProjectCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '项目'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'count',
    title: '应用数'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'spend',
    title: '消费金额'
  }
];
export const costPerClusterCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '集群'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'region',
    title: '区域'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'nodes',
    title: '节点数'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cost',
    title: '消费金额'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'status',
    title: '状态'
  }
];

export const clusterNamespaceCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    showIn: 'workload',
    title: 'Name'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'namespace',
    title: 'Namespace'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'pods',
    title: 'Pods',
    showIn: 'workload'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpu',
    title: 'CPU'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'memory',
    title: 'Memory'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'pv',
    title: 'PV'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'shared',
    title: 'Shared'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'spend',
    title: '消费金额'
  }
];

export const projectCostCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '名称'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'project',
    title: '项目'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cost',
    title: '消费金额'
  }
];
export default {};
