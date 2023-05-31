import { Edge, Node, Combo } from '@antv/g6';
import { InstanceResource } from '@/views/application-management/applications/config/interface';

export interface INode extends Node {
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
}
export interface ICombo {
  id: string;
  label: string;
  nodeType: string;
}

export default {};
