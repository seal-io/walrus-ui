import { AppRowData } from '@/views/application-management/applications/config/interface';
import { ConnectorRowData } from '@/views/operation-hub/connectors/config/interface';

export interface EnvironmentRow {
  id: string;
  name: string;
  description: string;
  createTime: string;
  labels: object;
  variables: object;
  edges: {
    connectors: ConnectorRowData[];
    applications: AppRowData[];
    revisions: any[];
    environmentConnectorRelationships: any[];
  };
  connectorIDs: string[];
}

export interface EnvironFormData {
  id?: string;
  name: string;
  description: string;
  connectorIDs: string[];
  edges: {
    connectors: any[];
  };
}
