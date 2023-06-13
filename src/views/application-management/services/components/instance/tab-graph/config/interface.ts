import { Edge, Node, Combo } from '@antv/g6';
import { InstanceResource } from '@/views/application-management/services/config/interface';

export interface INode extends Node {
  order?: number;
  id: string;
  name: string;
  resourceType: string;
  subType: string;
  data: InstanceResource;
  type: string;
  parentNode: string;
  label: string;
  description: string;
  executableInfo: {
    executable: boolean;
    data: object;
  };
  comboId: string;
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
}
export interface ICombo {
  order?: number;
  id: string;
  label: string;

  nodeType: string;
}

export default {};
