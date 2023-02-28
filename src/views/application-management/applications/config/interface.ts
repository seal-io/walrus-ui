export interface AppRowData {
  name: string;
  id: string;
  labels: object;
  description: string;
  environmentID: string;
  modules: Array<{
    moduleID: string;
    name: string;
    variables: object;
  }>;
}

export interface InstanceData {
  name: string;
  id: string;
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
