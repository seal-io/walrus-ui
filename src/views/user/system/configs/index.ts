import { CSSProperties } from 'vue';

export const valueTypeMap = {
  proxyWildcardDomainName: 'url',
  proxyPort: 'str',
  serverURL: 'url',
};

export interface ComponentType {
  type?: string;
  required?: string | boolean;
  match?: string;
  message?: string;
  extra?: string;
  binds?: Record<string, any>;
  validator?: (value: any, callback: (error?: string) => void) => void;
}
export type ValueType = any;

export interface ChildrenItem {
  parentId?: string;
  id: string;
  value: ValueType;
  hidden?: boolean;
  editable?: boolean;
  type?: string;
  label: string;
  desc?: string;
}
export interface DataListItem {
  parentId: string;
  parentValue?: ValueType;
  id: string;
  wrapId?: string;
  show?: (args: any) => boolean;
  childProperties?: Array<DataListItem>;
  value: ValueType;
  hidden?: boolean;
  label: string;
  desc?: string;
  editable?: boolean;
  style?: Record<string, any>;
  private?: boolean;
  component: ComponentType;
  type: string;
  children?: ChildrenItem[];
}
export interface SettingsItem {
  parentId: string;
  parentValue?: ValueType;
  id: string;
  value: ValueType;
  hidden?: boolean;
  label: string;
  desc?: string;
  editable?: boolean;
  private?: boolean;
  children?: ChildrenItem[];
  dataList?: Array<DataListItem>;
  component: ComponentType;
  type: string;
}

export const nonComponentList = ['layout', 'select-item'];
export default {
  valueTypeMap,
};
