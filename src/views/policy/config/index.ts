export const riskLevelList = [
  // { label: 'policy.risk.all', value: '' },
  { label: 'policy.risk.high', value: 'high' },
  { label: 'policy.risk.middle', value: 'medium' },
  { label: 'policy.risk.low', value: 'low' },
];
export const levelList = [
  { label: 'policy.risk.high', value: 'high' },
  { label: 'policy.risk.middle', value: 'medium' },
  { label: 'policy.risk.low', value: 'low' },
];
export const scopeTypeList = [
  { label: 'policy.detail.operator.all', value: 'all' },
  { label: 'policy.detail.operator.partial', value: 'partial' },
  { label: 'policy.detail.operator.containTags', value: 'tags' },
];
export const allScopeList = [
  { label: 'policy.detail.operator.all.projects', value: 'all' },
  { label: 'policy.detail.operator.all.proxy', value: 'proxy' },
];
export const partialScopeList = [
  { label: 'policy.detail.operator.partial.projects', value: 'projects' },
  { label: 'policy.detail.operator.partial.proxy', value: 'proxy' },
];
export const conditionFormatList = [
  { label: 'policy.detail.operator.condition.form', value: 'form' },
  { label: 'policy.detail.operator.condition.express', value: 'expr' },
];
export const constraintsTypeList = [
  { label: 'policy.detail.condition.all', value: 'AND' },
  { label: 'policy.detail.condition.any', value: 'OR' },
];

export const actionList = [
  { label: 'policy.action.block', value: 'block' },
  { label: 'policy.action.permit', value: 'permit' },
  { label: 'policy.action.warn', value: 'warn' },
];
export const typeList = [
  {
    value: 'vulnerability',
    label: 'policy.detail.vulnerabilityCVSScore',
  },
  { value: 'sastBuiltinSecretLeaks', label: 'policy.detail.sastSecretLeaks' },
  { value: 'licenseCompliance', label: 'policy.detail.licenseCompliance' },
  { value: 'package', label: 'policy.detail.category.dependencies' },
  { value: 'repositoryConfiguration', label: 'policy.detail.configCheck' },
  {
    value: 'sastCustomSecretLeaks',
    label: 'policy.detail.sastCustomSecretLeaks',
  },
  {
    value: 'sastSecretLeaksAllow',
    label: 'policy.detail.sastSecretLeaksAllow',
  },
];
// category map to policyType
export const policyTypeCategory = {
  sca: [
    { value: 'vulnerability', label: 'policy.detail.vulnerabilityCVSScore' },
    { value: 'licenseCompliance', label: 'policy.detail.licenseCompliance' },
    { value: 'package', label: 'policy.detail.category.dependencies' },
  ],
  sast: [
    // {
    //   value: 'sastBuiltinSecretLeaks',
    //   label: 'policy.detail.sastSecretLeaks',
    //   type: 'sast',
    // },
    {
      value: 'sastCustomSecretLeaks',
      label: 'policy.detail.sastCustomSecretLeaks',
      type: 'sast',
    },
    {
      value: 'sastSecretLeaksAllow',
      label: 'policy.detail.sastSecretLeaksAllow',
      type: 'whiteList',
    },
  ],
  configuration: [
    { value: 'repositoryConfiguration', label: 'policy.detail.configCheck' },
  ],
};
export const categoryList = [
  { label: 'policy.sourceRepo.basicConfig', value: 'configuration' },
  { label: 'policy.sourceRepo.codeCheck', value: 'sast' },
  { label: 'policy.menu.analysis', value: 'sca' },
];
export const policyTypeList = [
  { name: 'cvsParamsMetricMax' },
  { name: 'sastBuiltinSecretLeaks' },
];
export const scaMap = {
  'SEAL-POL-SCA-1': 'policy.action.sca1',
  'SEAL-POL-SCA-2': 'policy.action.sca2',
  'SEAL-POL-SCA-3': 'policy.action.sca3',
  'SEAL-POL-SCA-4': 'policy.action.sca4',
  'SEAL-POL-SCA-5': 'policy.action.sca5',
  'SEAL-POL-SCA-6': 'policy.action.sca6',
  'SEAL-POL-SCA-7': 'policy.action.sca7',
  'SEAL-POL-SCA-8': 'policy.action.sca8',
  'SEAL-POL-SCA-9': 'policy.action.sca9',
  'SEAL-POL-CONF-1': 'policy.action.conf1',
  'SEAL-POL-CONF-2': 'policy.action.conf2',
  'SEAL-POL-CONF-3': 'policy.action.conf3',
  'SEAL-POL-CONF-4': 'policy.action.conf4',
  'SEAL-POL-CONF-5': 'policy.action.conf5',
  'SEAL-POL-CONF-6': 'policy.action.conf6',
  'SEAL-POL-CONF-7': 'policy.action.conf7',
  'SEAL-POL-SAST-1': 'policy.action.sast1',
  'SEAL-IG-POL-SCA-1': 'policy.action.sca.whiteList',
};
export const typeMap = {
  ...scaMap,
  'vulnerability': 'policy.detail.vulnerabilityCVSScore',
  'vulnerabilitySeverity': 'policy.detail.conditionType.severity',
  'branchProtectionPullRequestRequireCodeOwnerReview':
    'policy.detail.configCheck',
  'branchProtectionPullRequestDismissStaleReview': 'policy.detail.configCheck',
  'branchProtectionRequiredStatusCheck': 'policy.detail.configCheck',
  'branchProtectionDisabled': 'policy.detail.configCheck',
  'licenseCompliance': 'policy.detail.licenseCompliance',
  'package': 'policy.detail.category.dependencies',
  'packageName': 'policy.detail.category.packageName',
  'packageNamespace': 'policy.detail.category.packageNamespace',
  'packageVersion': 'policy.detail.category.packageVersion',
  'packageType': 'policy.detail.category.packageType',
  'sastBuiltinSecretLeaks': 'policy.detail.sastSecretLeaks',
  'cvsParamsMetricName': 'policy.detail.cvsParamsMetricName',
  'cvsParamsMetricMax': 'policy.detail.cvsParamsMetricMax',
  'cvsParamsMetricMin': 'policy.detail.cvsParamsMetricMin',
  '==': 'policy.detail.operator.equal',
  '=': 'policy.detail.operator.equal',
  '!=': 'policy.detail.operator.notequal',
  '>': 'policy.detail.operator.gt',
  '>=': 'policy.detail.operator.ge',
  '<': 'policy.detail.operator.lt',
  '<=': 'policy.detail.operator.le',
  'in': 'policy.detail.operator.in',
  'notin': 'policy.detail.operator.notin',
  'and': 'policy.detail.operator.and',
  'or': 'policy.detail.operator.or',
  'versionGreaterThan': 'policy.detail.operator.versionGreaterThan',
  'versionLessThan': 'policy.detail.operator.versionLessThan',
  'versionWithinRange': 'policy.detail.operator.versionWithinRange',
  'matches': 'policy.detail.operator.matches',
  'withinRange': 'policy.detail.operator.withinRange',
  'licenseHasAnyTags': 'policy.detail.operator.belongToGroup',
  'vulnerabilityLevel': 'policy.detail.condition.serverity',
  'vulnerabilityCVS3Score': 'policy.detail.condition.cvsscore',
  'vulnerabilityID': 'policy.detail.condition.vulnerId',
  'high': 'policy.risk.high',
  'medium': 'policy.risk.middle',
  'low': 'policy.risk.low',
  'critical': 'policy.risk.critical',
  'secretLeaksPresent': 'policy.detail.secretLeaksPresent',
  'file': 'policy.detail.condition.file',
  'secretLeaksFilePathRegex':
    'policy.detail.conditionType.secretLeaksFilePathRegex',
  'secretLeaksRegex': 'policy.detail.conditionType.secretLeaksRegex',
  'licenseIDs': 'policy.detail.condition.licenseIDs',
  'branchProtectionRequiredStatusCheckDisabled':
    'policy.detail.condition.checkDisable',
  'branchProtectionPullRequestRequireCodeOwnerReviewDisabled':
    'policy.detail.condition.ownerReviewDisabled',
  'branchProtectionPullRequestDismissStaleReviewDisabled':
    'policy.detail.condition.reviewDisabled',
  'branchProtectionAllowDeletion': 'policy.detail.condition.allowDeletion',
  'branchProtectionPullRequestApprovingCount':
    'policy.detail.condition.approvingCount',
  'branchProtectionAllowForcePush': 'policy.detail.condition.forcePush',
  'branchProtectionPullRequestDisabled':
    'policy.detail.condition.requestDisabled',
};

export const operatorList = [
  { value: '==', label: 'policy.detail.operator.equal' },
  { value: '=', label: 'policy.detail.operator.equal' },
  { value: '!=', label: 'policy.detail.operator.notequal' },
  { value: '>', label: 'policy.detail.operator.gt' },
  { value: '>=', label: 'policy.detail.operator.ge' },
  { value: '<', label: 'policy.detail.operator.lt' },
  { value: '<=', label: 'policy.detail.operator.le' },
  { value: 'in', label: 'policy.detail.operator.in' },
  { value: 'notin', label: 'policy.detail.operator.notin' },
  { value: 'and', label: 'policy.detail.operator.and' },
  { value: 'or', label: 'policy.detail.operator.or' },
];
export const conditionTypeMap = {
  severity: 'policy.detail.conditionType.severity',
  LicenseName: 'policy.detail.conditionType.licenseName',
  requiredApprovingCount: 'policy.detail.conditionType.requiredApprovingCount',
};
export const expressTips = `例：
1.获取等级为Critical和high的漏洞
  vulnerability.severity == 'high' || vulnerability.severity == 'critical'

2.获取cvs3基础分数范围为7到9的漏洞
  vulnerability.cvs3.baseScore > 7 && vulnerability.cvs3.baseScore <= 9
`;

export const operatorConfigList = [
  { label: 'Equals', value: '==' },
  { label: 'Equals', value: '=' },
  { label: 'NotEquals', value: '!=' },
  { label: 'GreaterThan', value: '>' },
  { label: 'GreaterThanOrEqual', value: '>=' },
  { label: 'LessThan', value: '<' },
  { label: 'LessThanOrEqual', value: '<=' },
  { label: 'In', value: 'in' },
  { label: 'NotIn', value: 'notin' },
  { label: 'WithinRange', value: 'withinRange' },
  { label: 'BelongToGroup', value: 'belongToGroup' },
  { label: 'VersionGreaterThan', value: 'versionGreaterThan' },
  { label: 'VersionLessThan', value: 'versionLessThan' },
  { label: 'VersionWithinRange', value: 'versionWithinRange' },
];
export const inputOperator = ['==', '=', ' !=', '>', '>=', '<', '<='];
export const operatorMapToValueType = {
  in: 'multiple',
  notin: 'multiple',
  withinRange: 'range',
};
export const numberConditionMap = {
  branchProtectionPullRequestApprovingCount: true,
};
export const proxiesUsedList = [
  { value: 'docker', label: 'Docker' },
  { value: 'maven', label: 'Maven' },
];
export default {
  riskLevelList,
};
