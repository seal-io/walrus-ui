export interface RowData {
  kind: string;
  domain: string;
  name: string;
  builtin: boolean;
  roles: string;
  id: string;
}

export interface RoleItem {
  label: string;
  value: any;
  icon?: string;
}
export default {};
