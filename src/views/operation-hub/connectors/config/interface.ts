import { DataListItem, AxiosRequestPayload } from '@/types/global';

export interface ConnectorRowData extends DataListItem {
  spec: {
    enableFinOps?: boolean;
    applicableEnvironmentType: string;
    category: string;
    type: string;
    config: {
      version: string;
      data: {
        kubeconfig: {
          visible: boolean;
          value: string;
          type: string;
        };
      };
    };
  };
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

export interface ConnectorFormData extends AxiosRequestPayload {
  configDataFormat?: string;
  customConfig?: string;
  spec: {
    enableFinOps?: boolean;
    applicableEnvironmentType: string;
    category: string;
    type: string;
    description?: string;
    config: {
      version: string;
      data: {
        [key: string]: {
          visible: boolean;
          value: string;
          type: string;
        };
      };
    };
  };
}

export interface ConnectorTypeData {
  label: string;
  enable: boolean;
  value: string;
  com: string;
  route: string;
  globalRoute: string;
  icon: string;
}

export interface ProviderKey {
  label: string;
  value: string;
  key: string;
  visible: boolean;
  required: boolean;
  type: string;
}
