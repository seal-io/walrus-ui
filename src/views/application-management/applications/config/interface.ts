export interface Variables {
  name: string;
  default: any;
  type: string;
  description: string;
  required?: boolean;
}
export interface AppRowData {
  name: string;
  id: string;
  labels: object;
  status: string;
  description: string;
  environmentID: string;
  modules: Array<{
    moduleID: string;
    name: string;
    variables: object;
  }>;
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
    description: string;
  }>;
  modules: Array<{
    name: string;
    variables: object;
    module: {
      id: string;
    };
  }>;
}
export interface InstanceData {
  name: string;
  id: string;
  type: string;
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
  keys: ResourceKeysItem;
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
  endpoints: string[];
}
