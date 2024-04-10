import { ServiceRowData } from '@/views/application-management/services/config/interface';
import { ConnectorRowData } from '@/views/operation-hub/connectors/config/interface';
import { DataListItem } from '@/views/config/interface';

export interface EnvironmentRow extends DataListItem {
  id: string;
  name: string;
  description: string;
  createTime: string;
  labels: object;
  variables: object;
  edges: {
    connectors: ConnectorRowData[];
    applications: ServiceRowData[];
    revisions: any[];
    environmentConnectorRelationships: any[];
  };
  connectors?: any[];
  connectorIDs: string[];
}

export interface EnvironFormData {
  draft?: boolean;
  preview?: boolean;
  projectID?: string;
  id?: string;
  name: string;
  type: string;
  description: string;
  connectorIDs: string[];
  connectors: any[];
  edges?: any[];
  labels?: Record<string, any>;
  resources?: any[];
  variables?: any[];
}
