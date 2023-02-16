export const k8sOverview = [
  { label: '集群数', key: '', value: 23, color: '#324B4B' },
  { label: '节点数', key: '', value: 23, color: '#324B4B' },
  { label: 'Pods', key: '', value: 23, color: '#324B4B' }
];
export const saveOverview = [
  {
    label: '优化率',
    key: '',
    value: 15,
    suffix: '%',
    color: 'rgba(159,232,219,.6)'
  },
  { label: '每月可节省', key: '', value: 23, color: 'rgba(133,209,224,.6)' },
  { label: '每年可节省', key: '', value: 23, color: 'rgba(184,218,243,.6)' }
];

export const registryResourceCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '容器名称'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '命名空间'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpu',
    title: '预留CPU'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'maxCPU',
    title: '最大/平均 CPU使用量'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpu',
    title: '建议预留CPU'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpu',
    title: '最大/平均 内存使用量'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'cpu',
    title: '建议预留内存'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'saving',
    title: '节省金额'
  }
];
export const volumeCols = [
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'name',
    title: '持久卷名称'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'saving',
    title: '持久卷插件'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'saving',
    title: '容量'
  },
  {
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '40px' },
    dataIndex: 'saving',
    title: '节省金额'
  }
];
export default {};
