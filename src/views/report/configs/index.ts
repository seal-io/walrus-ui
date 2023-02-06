import { find, get, toLower } from 'lodash';
import { issuesItem } from '../api/report';

export const artifactConfig = [
  { label: 'report.detail.name', key: 'name', subkey: 'namespace', value: '' },
  { label: 'report.detail.version', key: 'version', value: '' },
  { label: 'report.detail.type', key: 'packageType', value: '' },
  {
    label: 'report.detail.packageManageFilePath',
    key: 'introducedThrough',
    value: '',
  },
  // { label: 'report.detail.language', key: 'language', value: '' },
  // { label: 'report.detail.purl', key: 'purl', value: '' },
];
export const licenseArtifactConfig = [
  { label: 'report.detail.name', key: 'name', subkey: 'namespace', value: '' },
  { label: 'report.detail.version', key: 'version', value: '' },
  { label: 'report.detail.type', key: 'packageType', value: '' },
  { label: 'report.detail.license', key: 'licenses', value: '' },
  { label: 'report.detail.purl', key: 'purl', value: '' },
];
export const licenseConfig = [
  { label: 'report.detail.name', key: 'name', subkey: 'namespace', value: '' },
  { label: 'report.detail.version', key: 'version', value: '' },
  { label: 'report.detail.type', key: 'packageType', value: '' },
  // { label: 'report.detail.license', key: 'licenses', value: '' },
  // { label: 'report.detail.purl', key: 'purl', value: '' },
];
export const occurrenceConfig = [
  { label: 'report.detail.eventTime', key: 'date', value: '' },
  { label: 'report.detail.type', key: 'RuleName', value: '' },
  { label: 'report.detail.author', key: 'author', value: '' },
  { label: 'Commit', key: 'commit', value: '', type: 'link', link: '' },
  { label: 'report.detail.commitMsg', key: 'message', value: '' },
  {
    label: 'report.detail.file',
    key: 'file',
    value: '',
    type: 'link',
    link: '',
  },
];
export const policyDataConfig = [
  { label: 'report.detail.name', key: 'name', value: '' },
  { label: 'report.detail.type', key: 'type', value: '', languageShow: true },
  { label: 'report.detail.description', key: 'description', value: '' },
  {
    label: 'report.detail.action',
    key: 'action',
    value: '',
    languageShow: true,
  },
  { label: 'report.detail.policyId', key: 'code', value: '' },
];

export const severityMaps = {
  high: 'report.detail.h',
  medium: 'report.detail.m',
  low: 'report.detail.l',
};
export const getViolationType = (data: issuesItem) => {
  const violationType = toLower(get(data, 'type'));
  if (violationType === 'vulnerability') {
    return 'vulnerability';
  }
  if (violationType === 'license') {
    return 'license';
  }

  if (['configuration', 'iac'].includes(violationType)) {
    return 'configure';
  }
  return 'other';
};

export const violationTypeList = [
  { label: 'common.select.option', value: 'all', subLabel: '' },
  {
    label: 'report.detail.vulnerability',
    value: 'vulnerability',
    subLabel: 'report.detail.vulnerability',
  },
  // { label: 'report.detail.sercurityTest', value: 'sast', subLabel: 'SAST' },
  {
    label: 'report.detail.license',
    value: 'license',
    subLabel: 'report.detail.license',
  },
  {
    label: 'policy.sourceRepo.basicConfig',
    value: 'configure',
    subLabel: 'policy.sourceRepo.basicConfig',
  },
  // {
  //   label: 'report.detail.depdencyInspect',
  //   value: 'dependency',
  //   subLabel: 'report.detail.depdencyInspect',
  // },
  {
    label: 'report.detail.customPolicy',
    value: 'other',
    subLabel: 'report.detail.customPolicy',
  },
];

export const ignoreReasonList = [
  { label: 'report.detail.ignore.falsePositive', value: 'falsePositive' },
  { label: 'report.detail.ignore.acceptable', value: 'acceptable' },
  { label: 'report.detail.ignore.noResource', value: 'noFix' },
  { label: 'report.detail.ignore.fixed', value: 'fixing' },
];
export const ignorePeriodList = [
  { label: 'report.detail.ignore.days', days: '30', value: 30 },
  { label: 'report.detail.ignore.days', days: '60', value: 60 },
  { label: 'report.detail.ignore.days', days: '180', value: 180 },
  { label: 'report.detail.ignore.permanent', days: '', value: 0 },
];
export const ignoreInfoConfig = [
  {
    label: 'report.detail.ignore.dismissedAt',
    value: '',
    key: 'dismissInfo.dismissAt',
    type: 'date',
  },
  {
    label: 'report.detail.ignore.reason',
    value: '',
    type: 'lookup',
    key: 'dismissInfo.dismissReason',
  },
  {
    label: 'report.detail.ignore.dismissExpiry',
    value: '',
    key: 'dismissInfo.dismissExpiry',
    type: 'date',
  },
  {
    label: 'report.detail.ignore.comment',
    value: '',
    key: 'dismissInfo.dismissComment',
  },
];
export const ignoreOptions = [
  { label: 'report.detail.ignore.all', value: 'all' },
  { label: 'report.detail.ignore.done', value: 'true' },
  { label: 'report.detail.ignore.undo', value: 'false' },
];
// custom sort setting
export const severityLevel = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};
export const violationTypeMap = {
  vulnerability: 'report.detail.vulnerability',
  license: 'report.detail.license',
  dependency: 'report.detail.depdencyInspecte',
  sast: 'SAST',
  configuration: 'policy.sourceRepo.basicConfig',
  secretLeak: 'report.detail.leakage',
  iac: 'report.detail.iac',
};
export const getViolationLabel = (val) => {
  const data = find(violationTypeList, (item) => {
    return val === item.value;
  });
  return get(data, 'subLabel') || '';
};
export default {
  artifactConfig,
};
