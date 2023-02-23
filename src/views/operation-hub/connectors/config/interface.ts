export interface ConnectorRowData {
  name: string;
  type: string;
  status: string;
  statusMessage: string;
  configData: object;
  enableFinOps: boolean;
  finOpsStatus: string;
  finOpsStatusMessage: string;
  createTime: string;
  edges: object;
  id: string;
}

export interface ConnectorFormData {
  id?: string;
  name: string;
  configData: {
    kubeConfig: string;
  };
  configVersion: string;
  enableFinOps: boolean;
}
