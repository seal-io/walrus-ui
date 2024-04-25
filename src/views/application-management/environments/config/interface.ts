import { ServiceRowData } from '@/views/application-management/services/config/interface';
import { ConnectorRowData } from '@/views/operation-hub/connectors/config/interface';
import { DataListItem, AxiosRequestPayload } from '@/types/global';

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

export interface EnvironFormData extends AxiosRequestPayload {
  metadata: {
    name: string;
    namespace: string;
    labels: object;
  };
  spec: {
    type: string;
    description: string;
    draft?: boolean;
    preview?: boolean;
  };
}

export interface ConnectorBindsFormData extends AxiosRequestPayload {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    connector: {
      name: string;
      namespace: string;
      category?: string;
      type?: string;
    };
  };
}
