export interface VariableRow {
  id: string;
  name: string;
  createTime: string;
}
export interface VariableFormData {
  name: string;
  description: string;
  value: string;
  environment: any;
  project: any;
  sensitive: boolean;
  id?: string;
}

export interface Variable {
  name: string;
  type: string;
  default: any;
  visible: boolean;
}
