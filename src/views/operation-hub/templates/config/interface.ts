type OutputItem = {
  [k: string]: string | boolean;
};
export interface Schema {
  outputs: OutputItem[];
  inputs: OutputItem[];
  readme: string;
  variables: OutputItem[];
  requiredProviders: Array<{
    name: string;
    source: string;
    version_constraints: string[];
  }>;
}
export interface ModuleAction {
  label: string;
  value: string;
  icon: string;
  requiredAuth: boolean;
  permission?: string[];
}

export interface TemplateFormData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    ownerReferences?: Array<{
      kind: string;
      name: string;
    }>;
  };
  spec: {
    templateFormat: string;
    description: string;
    vcsRepository: {
      platform: string;
      url: string;
      token?: string;
    };
  };
}

export interface TemplateVersion {
  originalUISchemaRef: {
    name: string;
  };
  schemaRef: {
    name: string;
  };
  uiSchemaRef: {
    name: string;
  };
  url: string;
  version: string;
}
export interface TemplateRowData extends TemplateFormData {
  status: {
    conditions: object[];
    phase: string;
    icon: string;
    url: string;
    lastSyncTime: string;
    versions: TemplateVersion[];
  };
}

export interface TemplateVersionData extends TemplateRowData {
  template: {
    id: string;
    name: string;
    version: string;
    template: { id: string }; // template not template version
  };
}
