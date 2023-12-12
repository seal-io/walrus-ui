import { ConnectorType } from '@/views/operation-hub/connectors/config';

const KubernetesBU = {
  K8sNamespaceSelect: 'K8sNamespaceSelect',
  K8sSecretSelect: 'K8sSecretSelect',
  K8sConfigMapSelect: 'K8sConfigMapSelect',
  K8sStorageClassSelect: 'K8sStorageClassSelect',
  K8sSecretSelectByNamespace: 'K8sSecretSelectByNamespace',
  K8sConfigMapSelectByNamespace: 'K8sConfigMapSelectByNamespace',
  K8sStorageClassSelectByNamespace: 'K8sStorageClassSelectByNamespace'
};

const DockerBU = {
  ImageSelect: 'ImageSelect',
  ImageTagSelect: 'ImageTagSelect'
};

const AWSBU = {
  AWSRegion: 'AWSRegion',
  AWSInstanceType: 'AWSInstanceType'
};

const AliBU = {
  AliyunRegion: 'AliyunRegion',
  AliyunInstanceType: 'AliyunInstanceType'
};

const GitBU = {
  CodeRepositorySelect: 'CodeRepositorySelect'
};

const VariableBU = {
  VariableSelect: 'VariableSelect',
  SensitiveVariableSelect: 'SensitiveVariableSelect'
};
export const BU = {
  CpuCore: 'CpuCore',
  Memory: 'Memory',
  Disk: 'Disk',
  ...DockerBU,
  ...KubernetesBU,
  ...AWSBU,
  ...AliBU,
  ...GitBU,
  ...VariableBU
};

export const WidgetAppendUnit = {
  [BU.CpuCore]: 'Core',
  [BU.Memory]: 'Mi',
  [BU.Disk]: 'Mi'
};

export const WidgetValueUnit = {
  [BU.CpuCore]: '',
  [BU.Memory]: '',
  [BU.Disk]: ''
};

export type BUType = (typeof BU)[keyof typeof BU];

export const CheckConnectorCatagory = (widget) => {
  if (KubernetesBU[widget]) {
    return ConnectorType.Kubernetes;
  }
  if (AWSBU[widget]) {
    return ConnectorType.AWS;
  }
  if (AliBU[widget]) {
    return ConnectorType.Alibaba;
  }
  if (GitBU[widget]) {
    return ConnectorType.Github;
  }
  return ConnectorType.Kubernetes;
};

export default {};
