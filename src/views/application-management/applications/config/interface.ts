export interface AppRowData {
  name: string;
  id: string;
  services: number;
  status: string;
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
