export interface TemplateRowData {
  id: string;
  source: string;
  schema: object;
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
  version: string;
}
