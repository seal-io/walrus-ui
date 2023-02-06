export interface TreeNodeData {
  nodeId: string;
  id: string;
  dependencyPackageIDs: string[];
  depsPkgIds: string[];
  pkgId: string;
  deps: TreeNodeData[];
  isLeaf: boolean;
  info: any;
  disabled?: boolean;
  nodeKey?: string;
  hasMatch?: boolean;
  nodePath: string[];
  parentId?: string;
  walked?: boolean;
  copyDeps?: TreeNodeData[];
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

export interface DepsData {
  packages: PackagesItem[];
  rootPackageID: string;
}
export type baseType = string | number;
export type loadMoreType = (...args: any[]) => any;
export default {};
