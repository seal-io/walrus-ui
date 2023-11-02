export const connectorTypeList = [
  {
    label: 'Kubernetes',
    enable: true,
    value: 'Kubernetes',
    com: 'kubernetes',
    route: 'ProjectConnectorK8sDetail',
    globalRoute: 'ConnectorK8sDetail',
    icon: 'icon-bxl-kubernetes'
  },
  {
    label: 'operation.connectors.reinstall.cloudProvider',
    enable: true,
    value: 'CloudProvider',
    com: 'cloud',
    route: 'ProjectConnectorProviderDetail',
    globalRoute: 'ConnectorProviderDetail',
    icon: 'icon-fill-cloud'
  },
  {
    label: 'operation.connectors.table.versioncontrol',
    enable: true,
    value: 'VersionControl',
    com: 'versionControl',
    route: 'ProjectConnectorScmDetail',
    globalRoute: 'ConnectorScmDetail',
    icon: 'icon-git'
  },
  {
    label: 'operation.connectors.reinstall.custom',
    enable: true,
    value: 'Custom',
    com: 'custom',
    route: 'ProjectConnectorCustomDetail',
    globalRoute: 'ConnectorCustomDetail',
    icon: 'icon-custom'
  }

  // { label: 'Cloud Provider', value: 'cloud', com: 'cloud' }
];

export const operationRootBread = {
  label: 'menu.operatorHub',
  icon: 'icon-relation',
  backAction: true,
  route: 'OperationMain'
};
export enum ConnectorCategory {
  VersionControl = 'VersionControl',
  Custom = 'Custom',
  CloudProvider = 'CloudProvider',
  Kubernetes = 'Kubernetes'
}

export const ConnectorType = {
  AWS: 'AWS',
  Alibaba: 'Alibaba',
  Kubernetes: 'Kubernetes',
  Github: 'Github'
};
export const CloudProviderType = {
  AWS: 'AWS',
  Alibaba: 'Alibaba'
};

export const cutomeTypeOptions = [
  { label: 'Alibaba', value: CloudProviderType.Alibaba },
  { label: 'AWS', value: CloudProviderType.AWS }
];

export const finOpsStatus = [
  { label: 'operation.connectors.status.ready', value: 'ready' },
  { label: 'operation.connectors.status.error', value: 'error' }
];
export default {};
