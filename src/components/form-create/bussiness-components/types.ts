export const BU = {
  ImageSelect: 'ImageSelect',
  NamespaceSelect: 'NamespaceSelect',
  SecretSelect: 'SecretSelect',
  ConfigMapSelect: 'ConfigMapSelect',
  StorageClassSelect: 'StorageClassSelect',
  Repository: 'Repository',
  CpuCore: 'CpuCore',
  Memory: 'Memory',
  AWSRegion: 'AWSRegion',
  AliyunRegion: 'AliyunRegion',
  AWSInstanceType: 'AWSInstanceType',
  AliyunInstanceType: 'AliyunInstanceType',
  Disk: 'Disk'
};

export type BUType = (typeof BU)[keyof typeof BU];
