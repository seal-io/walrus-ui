import { Edge, Node, Combo } from '@antv/g6';
import { ServiceResource } from '@/views/application-management/services/config/interface';

export interface INode extends Node {
  order?: number;
  id: string;
  nodeId: string;
  icon?: string;
  name: string;
  resourceType: string;
  subType: string;
  data: ServiceResource;
  kind: string;
  type: string;
  parentNode: string;
  label: string;
  description: string;
  descTips: string;
  executableInfo: {
    executable: boolean;
    data: object;
  };
  UMLDependencyIcon: string;
  UMLCompositionIcon: object;
  UMLRealizationIcon: string;
  hasComposition: boolean;
  visible?: boolean;
  isCollapsed: boolean;
  isFullscreen?: boolean;
  logoIcon: Record<string, any>;
  comboId: string;
  providerType: string;
  stateIcon: object;
  extensions: object;
  drifted: boolean;
  loggableInfo: {
    loggable: boolean;
    data: object;
  };
  stateStyles?: object;
  style: object;
}
export interface IEdge {
  source: string;
  target: string;
  style?: object;
  visible?: boolean;
  labelCfg?: object;
  legendType?: string;
  label?: string;
  edgeType: string;
}
export interface ICombo {
  order?: number;
  id: string;
  label: string;

  nodeType: string;
}

export default {};
