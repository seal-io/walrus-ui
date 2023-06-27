import { Edge, Node, Combo } from '@antv/g6';
import { ServiceResource } from '@/views/application-management/services/config/interface';

export interface INode extends Node {
  order?: number;
  id: string;
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
  logoIcon: Record<string, any>;
  comboId: string;
  providerType: string;
  stateIcon: object;
  loggableInfo: {
    loggable: boolean;
    data: object;
  };
}
export interface IEdge {
  source: string;
  target: string;
  style?: object;
  edgeType: string;
}
export interface ICombo {
  order?: number;
  id: string;
  label: string;

  nodeType: string;
}

export default {};
