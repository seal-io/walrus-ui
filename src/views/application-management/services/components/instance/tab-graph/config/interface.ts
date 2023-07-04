import { Edge, Node, Combo } from '@antv/g6';
import { ServiceResource } from '@/views/application-management/services/config/interface';

export interface INode extends Node {
  order?: number;
  id: string;
  nodeId: string;
  name: string;
  resourceType: string;
  subType: string;
  data: ServiceResource;
  kind: string;
  type: string;
  parentNode: string;
  label: string;
  description: string;
  executableInfo: {
    executable: boolean;
    data: object;
  };
  hasComposition: boolean;
  visible?: boolean;
  isCollapsed: boolean;
  logoIcon: Record<string, any>;
  comboId: string;
  providerType: string;
  stateIcon: object;
  extensions: any;
  loggableInfo: {
    loggable: boolean;
    data: object;
  };
}
export interface IEdge {
  source: string;
  target: string;
  style?: object;
  visible?: boolean;
  edgeType: string;
}
export interface ICombo {
  order?: number;
  id: string;
  label: string;

  nodeType: string;
}

export default {};
