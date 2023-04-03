export const connectorTypeList = [
  { label: 'Kubernetes', enable: true, value: 'Kubernetes', com: 'kubernetes' },
  {
    label: 'operation.connectors.table.versioncontrol',
    enable: true,
    value: 'VersionControl',
    com: 'versionControl'
  },
  {
    label: 'operation.connectors.reinstall.custom',
    enable: true,
    value: 'Custom',
    com: 'custom'
  }
  // { label: 'Cloud Provider', value: 'cloud', com: 'cloud' }
];

export const finOpsStatus = [
  { label: 'operation.connectors.status.ready', value: 'ready' },
  { label: 'operation.connectors.status.error', value: 'error' }
];
export default {};
