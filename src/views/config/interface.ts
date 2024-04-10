export interface BasicDescription {
  label: string;
  value: string;
  key: string;
  span?: number;
  editable?: boolean;
  disabled?: boolean;
  form?: string;
  required?: boolean;
  formatter?: (t: string) => string;
}

export interface BreadcrumbOptions {
  label: string;
  value: string;
  icon: string;
  iconfont?: boolean;
  type?: string;
  backAction?: boolean;
  hasOptions?: boolean;
  wrapperId: string;
  visible: boolean;
  hideDropDown?: boolean;
  inputValue?: string;
  level: string;
  onSetting?: (args: any) => void;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

export interface MoreAction {
  label: string;
  value: string;
  icon: string;
  iconfont?: boolean;
  handler?: string;
  disabled?: ((obj: any) => boolean) | boolean;
  filterFun?: (obj: any) => boolean;
  status?: 'normal' | 'warning' | 'success' | 'danger';
  style?: object;
  props?: {
    type?: string;
    class?: string;
  };
}

export type ModalActionType = 'edit' | 'create' | 'view';

export interface DeletePayload {
  items: { id: string }[];
}

export interface ListItem {
  label: string;
  value: string;
}

export interface HintKey {
  resource: any;
  var: any;
  service: any;
  workflow: any;
}

export interface DataListItem {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: object;
}

export default {};
