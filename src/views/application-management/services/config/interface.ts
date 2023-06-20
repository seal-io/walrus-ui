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
  template: { id: string; version: string };
  attributes: object;
}
export interface AppModule {
  name: string;
  variables: object;
  module: {
    id: string;
  };
  version: string;
}
export interface AppFormData {
  name: string;
  description: string;
  labels: object;
  project: { id: string };
  variables: Array<{
    name: string;
    default: any;
    type: string;
    description?: string;
  }>;
  modules: Array<{
    name: string;
    variables: object;
    version: string;
    module: {
      id: string;
    };
  }>;
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
export interface InstanceResource {
  id: string;
  name: string;
  type: string;
  status: string;
  createTime: string;
  key: string;
  keys: ResourceKeysItem;
  children?: InstanceResource[];
  composition: { id?: string; status: object };
  components: InstanceResource[];
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
