export interface ProjectRowData {
  name: string;
  id: string;
  description: string;
  labels: object;
  createTime: string;
  upateTime: string;
  label?: string;
  value?: string;
}

export interface ProjectFormData {
  id?: string;
  name: string;
  description: string;
  labels: object;
  labelList?: Array<{ key: string; value: string }>;
}

export interface ProjectRolesRowData {
  id: string;
  project: { id: string };
  role: { id: string };
  subject: any;
}
