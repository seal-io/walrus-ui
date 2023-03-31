export const connectorTypeList = [
  { label: 'Kubernetes', enable: true, value: 'Kubernetes', com: 'kubernetes' },
  {
    label: '版本控制',
    enable: true,
    value: 'VersionControl',
    com: 'versionControl'
  },
  { label: '自定义', enable: true, value: 'Custom', com: 'custom' }
  // { label: 'Cloud Provider', value: 'cloud', com: 'cloud' }
];

export const finOpsStatus = [
  { label: '集群成本分析工具为可用状态', value: 'ready' },
  { label: '集群成本分析工具不可用，尝试重装', value: 'error' }
];
export default {};
