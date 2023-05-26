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
  },
  {
    label: 'operation.connectors.reinstall.cloudProvider',
    enable: true,
    value: 'CloudProvider',
    com: 'cloud'
  }
  // { label: 'Cloud Provider', value: 'cloud', com: 'cloud' }
];
export enum ConnectorCategory {
  VersionControl = 'VersionControl',
  Custom = 'Custom',
  CloudProvider = 'CloudProvider',
  Kubernetes = 'Kubernetes'
}
export const finOpsStatus = [
  { label: 'operation.connectors.status.ready', value: 'ready' },
  { label: 'operation.connectors.status.error', value: 'error' }
];
export default {};
