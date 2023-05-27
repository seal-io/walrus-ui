import { get } from 'lodash';

export const queryConfig = [
  {
    label: 'graph.resource.type.resource',
    value: 'Resource',
    color: ''
  },
  {
    label: 'graph.resource.type.package',
    value: 'Package',
    color: ''
  },
  {
    label: 'graph.resource.type.vuln',
    value: 'Vulnerability',
    color: ''
  },
  {
    label: 'graph.resource.type.file',
    value: 'File',
    color: ''
  }
];

export const severityList = [
  { label: 'projects.risk.critical', value: 'CRITICAL' },
  { label: 'projects.risk.high', value: 'HIGH' },
  { label: 'projects.risk.middle', value: 'MEDIUM' },
  { label: 'projects.risk.low', value: 'LOW' },
  { label: 'projects.risk.none', value: 'NONE' }
];
export const issueList = [
  {
    label: 'projects.risk.high',
    value: '',
    key: 'properties.issueHighCount',
    severity: 'high'
  },
  {
    label: 'projects.risk.middle',
    value: '',
    key: 'properties.issueMediumCount',
    severity: 'medium'
  },
  {
    label: 'projects.risk.low',
    value: '',
    key: 'properties.issueLowCount',
    severity: 'low'
  }
];
export const dataColorMap = {
  Vulnerability: '242,135,13',
  Package: '134,144,156',
  Resource: '17, 75, 163',
  File: '43, 176, 172'
};
export const dataStrokeColorMap = {
  Vulnerability: '229,104,93',
  Package: '134,144,156',
  Resource: '0,164,198',
  File: '55, 212, 207'
};
export const dataInactiveColorMap = {
  Vulnerability: '240,218,194',
  Package: '228,230,231',
  Resource: '228,230,231',
  File: '193,240,239'
};
export const graphColorConfig = {
  label: '17, 75, 163',
  edge: '171,178,186',
  inactiveEdge: '241,242,244'
};
export const severityColorValueMap = {
  critical: '203, 39, 45',
  high: '203, 39, 45',
  medium: '255, 125, 0',
  low: '250, 220, 25',
  none: '250, 220, 25'
};
export const graphResourceTypeMap = new Map([
  ['vuln', ['Vulnerability']],
  ['package', ['Package']],
  ['resource', ['Resource']],
  ['file', ['File']]
]);
export const resourceTypeMap = {
  Resource: 'graph.resource.type.resource',
  Package: 'graph.resource.type.package',
  File: 'graph.resource.type.file'
};
export const resourceNodeInfo = [
  {
    label: 'graph.filter.resourceType',
    value: '',
    key: 'labels.0',
    locale: true
  },
  {
    label: 'graph.resource.node.name',
    value: '',
    key: 'properties.fullName',
    copy: false,
    link: '#/resource/detail?versionId=latest'
  }
];
export const fileNodeInfo = [
  {
    label: 'graph.filter.resourceType',
    value: '',
    key: 'labels.0',
    locale: true
  },
  {
    label: 'graph.resource.node.name',
    value: '',
    key: 'properties.name',
    copy: false,
    link: ''
  }
];
export const packageNodeInfo = [
  {
    label: 'graph.filter.resourceType',
    value: '',
    key: 'labels.0',
    locale: true
  },
  {
    label: 'graph.resource.node.name',
    value: '',
    key: 'properties.name',
    copy: false,
    link: '#/components/detail?'
  },
  {
    label: 'graph.resource.node.version',
    value: '',
    key: 'properties.version'
  },
  {
    label: 'graph.resource.node.lastversion',
    value: '',
    key: 'properties.latestVersion'
  },
  { label: 'purl', value: '', key: 'properties.purl', copy: true }
];
export const vulnNodeInfo = [
  {
    label: 'graph.filter.resourceType',
    value: '',
    key: 'labels.0',
    copy: false,
    locale: true
  },
  {
    label: 'graph.resource.node.name',
    value: '',
    key: 'properties.name',
    copy: false,
    link: '#/vulnerability/detail?'
  },
  { label: 'CVSS', value: '', key: 'properties.cvss.baseScore', copy: false },
  {
    label: 'graph.resource.node.version',
    value: '',
    key: 'properties.cvss.version'
  },
  {
    label: 'graph.resource.node.lastversion',
    value: '',
    key: 'properties.cvss.baseSeverity'
  },
  { label: 'purl', value: '', key: 'properties.purl', copy: true }
];
const isResource = (type) => {
  return type === 'Resource';
};
const isPackage = (type) => {
  return type === 'Package';
};
const isFile = (type) => {
  return type === 'File';
};
export const NodeType = {
  isResource(type) {
    return type === 'Resource';
  },
  isPackage(type) {
    return type === 'Package';
  },
  isFile(type) {
    return type === 'File';
  },
  hasVuln(node) {
    return (
      get(node, 'properties.issueTotalCount') ||
      get(node, 'properties.vulnerable')
    );
  }
};
export const EdgeType = {
  isDependsOn(type) {
    return type === 'DependsOn';
  },
  isAssociatesWith(type) {
    return type === 'AssociatesWith';
  }
};
export const NodeTypeMap = new Map([
  ['isResource', isResource],
  ['isPackage', isPackage],
  ['isFile', isFile]
]);
export const getNodeSize = (size) => {
  const sizeList = [0, 10, 20, 30, 40];
  let level = 0;
  let current = sizeList[level];
  while (size > current) {
    level += 1;
    current = sizeList[level];
  }
  return level;
};
export const nodeSizeMap = new Map([
  [0, 10],
  [1, 15],
  [2, 20],
  [3, 25],
  [4, 30],
  [5, 35]
]);

export const resourceNodeSizeMap = new Map([
  [0, 1.5],
  [1, 3],
  [2, 4.5],
  [3, 6],
  [4, 6.5],
  [5, 8]
]);

export default {};
