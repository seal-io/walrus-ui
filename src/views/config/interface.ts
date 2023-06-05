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
  type?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
}
export default {};
