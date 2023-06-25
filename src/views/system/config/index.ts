import { CSSProperties } from 'vue';

export const valueTypeMap = {
  proxyWildcardDomainName: 'url',
  proxyPort: 'str',
  serverURL: 'url'
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
  isEditable?: boolean;
  style?: Record<string, any>;
  private?: boolean;
  component: ComponentType;
  type: string;
  children?: ChildrenItem[];
  subGroup?: Array<DataListItem>;
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
export const expireList = [
  { label: 'account.settings.expire.week', type: 'day', value: 7 },
  { label: 'account.settings.expire.month', type: 'month', value: 1 },
  { label: 'account.settings.expire.six', type: 'month', value: 6 },
  { label: 'account.settings.expire.year', type: 'year', value: 1 },
  { label: 'account.settings.expire.never', type: 'never', value: '' }
];

export const nonComponentList = ['layout', 'select-item'];
export default {
  valueTypeMap
};
