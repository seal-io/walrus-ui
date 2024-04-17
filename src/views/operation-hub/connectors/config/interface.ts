import { DataListItem, AxiosRequestPayload } from '@/types/global';

export type ConnectorRowData = DataListItem;

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

export type ConnectorFormData = AxiosRequestPayload;

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
