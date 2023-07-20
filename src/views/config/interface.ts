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
  handler?: string;
  disabled?: ((obj: any) => boolean) | boolean;
  filterFun?: (obj: any) => boolean;
  status: 'normal' | 'warning' | 'success' | 'danger';
  props?: {
    type: string;
  };
}
export default {};
