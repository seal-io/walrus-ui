type OutputItem = {
  [k: string]: string | boolean;
};
export interface Schema {
  outputs: OutputItem[];
  inputs: OutputItem[];
  readme: string;
  variables: OutputItem[];
  requiredProviders: Array<{
    name: string;
    source: string;
    version_constraints: string[];
  }>;
}
export interface ModuleAction {
  label: string;
  value: string;
  icon: string;
  requiredAuth: boolean;
  permission?: string[];
}
export interface TemplateRowData {
  id: string;
  source: string;
  schema: Schema;
  name: string;
  templateName: string;
  description: string;
  status: string;
  createTime: string;
  version: string;
  disabled?: boolean;
  updateTime: string;
  edges: object;
  icon?: string;
  template?: { id: string; name: string; version: string };
}
export interface TemplateVersionData extends TemplateRowData {
  template: { id: string; name: string; version: string };
}
export interface TemplateFormData {
  id?: string;
  description: string;
  source: string;
  version?: string;
}
