export interface Variables {
  name: string;
  default: any;
  type: string;
  value?: any;
  description?: string;
  required?: boolean;
}

export interface ServiceRowData {
  name: string;
  id: string;
  labels: object;
  status: string;
  description: string;
  environment: { id: string; name: string };
  project: { id: string };
  template: { id: string; version: string; name: string };
  attributes: object;
}

export interface DriftDataItem {
  address: string;
  change: {
    actions: string[];
    after: object;
    afterSensitive: object;
    afterUnknown: object;
    before: object;
    beforeSensitive: object;
  };
  mode: string;
  moduleAddress: string;
  name: string;
  providerName: string;
  type: string;
}

export interface InstanceData {
  name: string;
  id: string;
  type: string;
  status: object;
  projectId: { id: string };
  attributes: Record<string, any>;
  environment: {
    id: string;
    name: string;
  };
}
export interface KeysItem {
  executable?: boolean;
  loggable?: boolean;
  name: string;
  value: string;
  keys?: KeysItem[];
}
export interface Cascader {
  label: string;
  value: string;
  executable?: boolean;
  loggable?: boolean;
  children: Cascader[];
}
export interface ResourceKeysItem {
  labels?: string[];
  keys: KeysItem[];
}
export interface ServiceResource {
  id: string;
  name: string;
  type: string;
  status: string;
  createTime: string;
  key: string;
  keys: ResourceKeysItem;
  children?: ServiceResource[];
  composition: { id?: string; status: object };
  components: ServiceResource[];
}
export interface HistoryData {
  id: string;
  status: string;
  statusMessage: string;
  createTime: string;
  deployerType: string;
  instance: {
    id: string;
    name: string;
    status: string;
    createTime: string;
    statusMessage: string;
  };
}

export interface EndPointRow {
  resourceID: string;
  resourceKind: string;
  resourceSubKind: string;
  moduleName: string;
  name: string;
  endpoints: string[];
  id?: string;
}

export interface OutputsRow {
  moduleName: string;
  name: string;
  type: string[];
  value: any;
  id?: string;
}

export interface ResourceKey {
  label: string;
  id: string;
  value: string;
}
