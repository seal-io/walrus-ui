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
export default {};
