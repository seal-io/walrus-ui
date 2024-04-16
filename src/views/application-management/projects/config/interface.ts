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
  name: string;
  namespace: string;
  role: string;
}
