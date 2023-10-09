import _ from 'lodash';
import { FieldRule } from '@arco-design/web-vue';

export interface OptionsItem {
  label: string;
  value: string;
}
export interface LabelListItem {
  key?: string;
  label?: string;
  value: string | number;
}

export interface ComponentSchema {
  name: string;
  type: string;
  default: any;
  showCondition: { key: string; value: string };
  conditions: Array<{
    variable: string;
    operator: string;
    value: string;
  }>;
  parentCom: string;
  childCom: string;
  required: boolean;
  sensitive: boolean;
  description: string;
  showIf?: string;
  order?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  isRequired?: string;
  options?: { label: string; value: string }[];
  label?: string;
  group?: string;
  subGroup?: string;
  mainGroup?: string;
  thirdGroup?: string;
  subGroupOrder?: number;
  thirdGroupOrder?: number;
  props?: object;
  rules?: FieldRule[];
  labelList?: LabelListItem[];
}

export default {};
