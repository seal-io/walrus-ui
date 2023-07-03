export interface VariableRow {
  id: string;
  name: string;
  createTime: string;
}
export interface VariableFormData {
  name: string;
  value: string;
  id?: string;
  project: {
    id: string | number;
  };
}
