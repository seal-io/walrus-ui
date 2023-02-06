export interface childrenItem {
  checked: boolean;
  title: string;
  value: string | number;
  isLocale?: boolean;
  key: string;
  id: string;
}

export interface filterItem {
  title: string;
  isLocale?: boolean;
  filterType: string;
  type: string | number;
  children: childrenItem[];
}
export const scanSettinsOptions = [
  { label: 'resource.scan.settings.daily', value: 86400 },
  { label: 'resource.scan.settings.weekly', value: 604800 },
];
export const uploadSbomConfig = [
  {
    id: 'uploaded',
    provider: 'uploaded',
    value: 'uploaded',
    text: 'projects.resource.upload.sbom',
    title: 'projects.resource.upload.sbom',
    langFormat: true,
  },
];
export const withIssuesList = [
  { label: 'projects.select.issues.with', value: 'true' },
  { label: 'projects.select.issues.without', value: 'false' },
];
export const tabList = [
  { value: 'table', label: 'table' },
  { value: 'tree', label: 'tree' },
];
export const repoBasicConfig = [
  { key: 'fullName', label: 'sbom.project.name' },
  { key: 'url', label: 'sbom.project.link' },
  { key: 'createTime', label: 'sbom.project.createtime' },
  { key: 'lastEvaluationTime', label: 'sbom.project.lasttime' },
];
export const filterConfig: filterItem[] = [
  {
    title: 'projects.filter.show',
    isLocale: true,
    filterType: 'withIssues',
    type: 1,
    children: [
      {
        checked: false,
        title: 'With issues',
        value: 0,
        key: '',
        id: 'true',
      },
      {
        checked: false,
        title: 'Without issues',
        value: 0,
        key: '',
        id: 'false',
      },
      // { checked: false, title: 'Active', value: 13, key: '' },
      // { checked: false, title: 'Inactive', value: 14, key: '' },
    ],
  },
  {
    title: 'projects.filter.integration',
    type: 2,
    filterType: 'provider',
    isLocale: true,
    children: [
      // { checked: false, title: 'CI/CLI', value: 21, key: '' },
      { checked: false, title: 'GitHub', value: 0, key: '', id: 'github' },
    ],
  },
];
export const directConfigList = [
  { label: 'resource.detail.components.relationdirect', value: 'true' },
  { label: 'resource.detail.components.relationindirect', value: 'false' },
];
const labelStyle = {
  show: false,
  formatter: '{d}({b})',
  fontWeight: 700,
  // color: 'rgba(255,255,255,1)',
  fontSize: 14,
  position: 'outside',
};
export const pieConfig = [
  {
    value: 0,
    name: 'H',
    key: 'highSeverityIssueNum',
    label: labelStyle,
    itemStyle: {
      color: 'rgba(245, 63, 63, 0.8)',
    },
  },
  {
    value: 0,
    name: 'M',
    key: 'mediumSeverityIssueNum',
    label: labelStyle,
    itemStyle: {
      color: 'rgba(255, 125, 0, 0.8)',
    },
  },
  {
    value: 0,
    name: 'L',
    key: 'lowSeverityIssueNum',
    label: labelStyle,
    itemStyle: {
      color: 'rgba(250, 220, 25, 0.8)',
    },
  },
];
export const issueTabList = [
  { label: 'projects.resource.tabfix.fix', value: 'fix', component: 'TabFix' },
  {
    label: 'projects.resource.tabfix.violation',
    value: 'violation',
    component: 'TabViolation',
  },
  {
    label: 'projects.history.table.components',
    value: 'component',
    component: 'TabComponent',
  },
  {
    label: 'resource.detail.license.title',
    value: 'license',
    component: 'TabLicense',
  },
];
export const issueTypeFilter = [
  { label: 'projects.fixdetail.table.vulner', value: 'vuln' },
  { label: 'SAST', value: 'sast' },
  { label: 'projects.resource.tabfix.block', value: 'block' },
  { label: 'projects.resource.tabfix.others', value: 'other' },
];
export const severityTypeFilter = [
  { label: 'projects.risk.critical', value: 'critical' },
  { label: 'projects.risk.high', value: 'high' },
  { label: 'projects.risk.middle', value: 'medium' },
  { label: 'projects.risk.low', value: 'low' },
];
export const pluginTypeFilter = [
  { label: 'SCA', value: 'sca' },
  { label: 'SAST', value: 'sast' },
  { label: 'Configuration', value: 'configuration' },
  { label: 'IaC', value: 'iac' },
];
export const maturityTypeFilter = [
  { label: 'projects.resource.tabfix.maturity', value: 'maturity' },
  { label: 'projects.resource.tabfix.poc', value: 'poc' },
  { label: 'projects.resource.tabfix.noKnownExploit', value: 'noKnownExploit' },
  { label: 'projects.resource.tabfix.nodata', value: 'noData' },
];
export const fixTypeFilter = [
  { label: 'projects.resource.tabfix.patched', value: 'maturity' },
  { label: 'projects.resource.tabfix.partial', value: 'poc' },
  { label: 'projects.resource.tabfix.unavailable', value: 'noKnownExploit' },
];
export const fixAdviceBasic = [
  { label: 'common.table.operation', value: '', key: 'action' },
  { label: 'projects.fixdetail.deps', value: '', key: 'softwarePackage.name' },
  {
    label: 'projects.fixdetail.oldversion',
    value: '',
    key: 'softwarePackage.from.version',
    isFixable: true,
  },
  {
    label: 'projects.resource.tabfix.currentVersion',
    value: '',
    key: 'softwarePackage.from.version',
    isFixable: false,
  },
  {
    label: 'projects.table.description',
    value: '',
    key: 'softwarePackage.reason',
    isFixable: false,
  },
  {
    label: 'projects.fixdetail.newversion',
    value: '',
    key: 'softwarePackage.to.version',
    isFixable: true,
  },
  {
    label: 'projects.resource.tabfix.compatibility',
    value: '',
    key: 'compatibilityLevel',
    isFixable: true,
  },
];
export const incompatibleReasonList = [
  {
    label: 'resource.tabfix.unfixed.reason.Package',
    value: 'fix it manually',
  },
  {
    label: 'resource.tabfix.unfixed.reason.candidates',
    value: 'find candidates',
  },
  {
    label: 'resource.tabfix.unfixed.reason.find',
    value: 'filtering out versions',
  },
  {
    label: 'resource.tabfix.unfixed.reason.generate',
    value: 'filtering out vulnerable',
  },
];

export const incompatibleNoUpgradeReasonList = [
  {
    label: 'resource.detail.fix.manual',
    value: `need to fix it manually`,
  },
  {
    label: 'resource.detail.fix.pom.check',
    value: 'POM file is invalid, please check',
  },
  {
    label: 'resource.detail.fix.nonpom',
    value: 'Found Non-resolvable parent POM file',
  },
];
export const compatibleDescMap = {
  incompatible: 'resource.tabfix.table.compatbility.incompatible',
  different: 'resource.tabfix.table.compatbility.different',
  breaking: 'resource.tabfix.table.compatbility.breaking',
};

export const getIncomptableReason = (list, value) => {
  if (!value) return '';
  const data = list.find((item) => value.indexOf(item.value) > -1);
  if (data) {
    return data.label;
  }
  return '';
};

export default {
  filterConfig,
};
