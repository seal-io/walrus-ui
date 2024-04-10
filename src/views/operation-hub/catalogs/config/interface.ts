export interface CatalogFormData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    builtin?: boolean;
    templateFormat: string;
    description: string;
    vcsSource: {
      platform: string;
      url: string;
      token?: string;
    };
    filtering: {
      excludeFilter: string;
      includeFilter: string;
    };
  };
}

export interface CatalogRowData extends CatalogFormData {
  disabled?: boolean;
  metadataName?: string;
  sync: {
    time: string;
    total: number;
    failed: number;
    succeeded: number;
  };
}

export default {};
