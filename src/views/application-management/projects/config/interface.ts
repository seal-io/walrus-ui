import { DataListItem } from '@/types/global';

export type ProjectRowData = DataListItem;

export interface ProjectFormData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels: { [key: string]: string };
  };
  spec: {
    displayName?: string;
    description: string;
  };
}

export interface ProjectRolesRowData {
  id: string;
  project: { id: string };
  role: { id: string };
  subject: any;
}
