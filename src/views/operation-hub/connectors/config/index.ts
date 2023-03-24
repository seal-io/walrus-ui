export const connectorTypeList = [
  { label: 'Kubernetes', enable: true, value: 'k8s', com: 'kubernetes' },
  {
    label: '版本管理',
    enable: true,
    value: 'scm',
    com: 'versionControl'
  },
  { label: 'Cloud Provider', value: 'cloud', com: 'cloud' },
  { label: '自定义', value: 'custom', com: 'custom' }
];

export const finOpsStatus = [
  { label: '集群成本分析工具为可用状态', value: 'ready' },
  { label: '集群成本分析工具不可用，尝试重装', value: 'error' }
];
export default {};
