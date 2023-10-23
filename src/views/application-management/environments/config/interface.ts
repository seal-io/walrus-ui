import { ServiceRowData } from '@/views/application-management/services/config/interface';
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
    applications: ServiceRowData[];
    revisions: any[];
    environmentConnectorRelationships: any[];
  };
  connectors?: any[];
  connectorIDs: string[];
}

export interface EnvironFormData {
  projectID?: string;
  id?: string;
  name: string;
  type: string;
  description: string;
  connectorIDs: string[];
  connectors: any[];
  edges?: any[];
  labels?: Record<string, any>;
  services?: any[];
  variables?: any[];
}
