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
  { label: 'Spend Total', key: '', value: 9, color: '#0F8584' },
  { label: 'Total Projects', key: '', value: 12, color: '#7AB6B5' },
  { label: 'Total Kubernetes Cluster', key: '', value: 23, color: '#324B4B' }
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
export default {};
