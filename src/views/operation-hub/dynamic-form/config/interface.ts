import { FieldRule } from '@arco-design/web-vue';

export interface LabelListItem {
  key?: string;
  label?: string;
  value: string | number;
}

export interface UISchema {
  showIf?: string;
  widget?: string;
  showCondition?: { key: string; value: string };
  conditions?: Array<{
    variable: string;
    operator: string;
    value: string;
  }>;
  required?: boolean;
  hidden?: boolean;
  immutable?: boolean;
  sensitive?: boolean;
  group?: string;
  subGroup?: string;
  mainGroup?: string;
  thirdGroup?: string;
  subGroupOrder?: number;
  thirdGroupOrder?: number;
  labelList?: LabelListItem[];
  order?: number;
  style?: object;
  props?: object;
  rules?: FieldRule[];
}
export interface FieldSchema {
  name: string;
  fieldPath: string[];
  type: string;
  default: any;
  uiSchema: UISchema;
  description: string;
  multipleOf?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  enum?: any[];
  items?: any[];
  options?: { label: string; value: string }[];
  label?: string;
}
