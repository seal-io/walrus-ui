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

export interface InstanceResource {
  name: string;
  type: string;
  status: string;
}
export interface HistoryData {
  version: string;
  createTime?: string;
  operator: string;
}
