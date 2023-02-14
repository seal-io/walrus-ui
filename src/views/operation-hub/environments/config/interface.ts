export interface EnvironmentRow {
  name: string;
  description: string;
  createTime: string;
  id: string;
}

export interface EnvironFormData {
  name: string;
  description: string;
  connectors: string[];
}
