import { AppRowData } from '@/views/application-management/applications/config/interface';

export interface ProjectRowData {
  name: string;
  id: string;
  description: string;
  labels: object;
  createTime: string;
  upateTime: string;
  edges: {
    applications: AppRowData[];
  };
}

export interface ProjectFormData {
  id?: string;
  name: string;
  description: string;
  labels: object;
  labelList?: Array<{ key: string; value: string }>;
}
