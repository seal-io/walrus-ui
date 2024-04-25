import { DataListItem, AxiosRequestPayload } from '@/types/global';

export type VariableRow = DataListItem;
export interface VariableFormData extends AxiosRequestPayload {
  spec: {
    value: string;
    sensitive: boolean;
    description: string;
  };
  status: {
    scope: string;
    value?: string;
  };
}

export type VariableScopeType =
  | 'Environment'
  | 'Project'
  | 'System'
  | 'Service';
export interface Variable {
  name: string;
  type: string;
  default: any;
  visible: boolean;
}
