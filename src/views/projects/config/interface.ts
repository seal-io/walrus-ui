type functionCallback = (...args: any[]) => any;
export interface TableRowData {
  id: string;
  name: string;
  version: string;
  namespace: string;
  direct: boolean;
  licenses: string;
  packageSystem: string;
  purl: string;
  language: string;
  repositoryIDs: string[];
}

export interface PackagesItem {
  dependencyPackageIDs?: string[];
  id: string;
  language?: string;
  name: string;
  namespace: string;
  packageSystem: string;
  purl: string;
  version: string;
}
export interface HistoryTableRow {
  version: string;
  createTime: string;
  dependencyCount: number;
}

export interface NodeGraph {
  pkgId: string;
  nodeId: string;
  nodeIndex: string | number;
  nodeKey: string | number;
  disabled?: boolean;
  isLeaf?: boolean;
  info: any;
  deps: Array<NodeGraph>;
}

export interface PopupItem {
  id: string;
  provider: string;
  type?: string;
  text: string;
  title: string;
  page?: string;
  langFormat?: boolean;
  containerRegistryID?: string;
  clickHandler?: functionCallback;
}
export interface UserItem {
  displayName: string;
  accountId: string;
  name?: string;
  id?: string;
  value?: string;
}
export interface CustomField {
  allowedValues: Array<{ id: string; name: string; value: string }>;
  key: string;
  fieldId?: string;
  hasDefaultValue: boolean;
  name: string;
  comType?: string;
  fieldType?: string;
  operations: string[];
  required: boolean;
  schema: { system: string; type: string };
}
