type OutputItem = {
  [k: string]: string | boolean;
};
export interface Schema {
  Outputs: OutputItem[];
  Inputs: OutputItem[];
  Readme: string;
  Variables: OutputItem[];
  RequiredConnectorTypes: string[];
}

export interface TemplateRowData {
  id: string;
  source: string;
  schema: Schema;
  description: string;
  status: string;
  createTime: string;
  updateTime: string;
  edges: object;
  icon?: string;
}

export interface TemplateFormData {
  id: string;
  description: string;
  source: string;
  version?: string;
}
