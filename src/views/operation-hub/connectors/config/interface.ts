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
  label?: string;
  value?: string;
}

export interface CustomAttrbute {
  key: string;
  value: any;
  type: string;
  default?: any;
  extraCom?: string;
  visible?: boolean;
  extraProps?: any;
  error?: string;
  style?: object;
}

export interface ConnectorFormData {
  projectID: string;
  id?: string;
  name: string;
  description?: string;
  type: string;
  configData: {
    // kubeconfig?: {
    //   visible?: boolean;
    //   value: string;
    //   type?: string;
    // };
    // token?: {
    //   visible?: boolean;
    //   value: string;
    //   type?: string;
    // };
    [k: string]: {
      visible?: boolean;
      value: string;
      type?: string;
    };
  };
  configVersion: string;
  enableFinOps: boolean;
}
