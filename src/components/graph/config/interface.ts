import { ModelStyle, StateStyles } from '@antv/g6';
import { partial } from 'lodash';

export interface LicenseItem {
  license: { id: string };
}
export interface Vulnerability {
  version: string;
  vectorString: string;
  baseScore: string;
  baseSeverity: string;
  exploitabilityScore: string;
  impactScore: string;
}
export interface NodeItem {
  labels: string[];
  name?: string;
  type: string;
  severity: string;
  isCollapsed?: boolean;
  sizeLevel: number;
  vulnTotal: number;
  img?: string;
  icon?: any;
  visible?: false;
  lineWidth?: number;
  stroke?: string;
  inactiveStroke?: string;
  inactiveColor?: string;
  resourceType: string;
  clipCfg: any;
  primaryColor?: string;
  vulnSummary?: Record<string, number>;
  properties: {
    licenses?: LicenseItem[];
    cvss?: Vulnerability;
    name: string;
    purl?: string;
    type?: string;
    version: string;
    latestVersion?: string;
  };
  id: string;
  label: string;
  style?: any;
  size?: number;
  stateStyles?: StateStyles;
  cluster?: string;
}

export interface EdgeItem {
  id: string;
  type: string;
  startNode: string;
  endNode: string;
  properties?: object;
  source?: string;
  target?: string;
  style?: any;
  stateStyles?: StateStyles;
}
