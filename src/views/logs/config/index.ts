export const statusList = [
  { label: 'logs.status.pass', value: 'permit' },
  { label: 'logs.status.working', value: 'running' },
  { label: 'logs.status.block', value: 'block' },
  { label: 'logs.status.warning', value: 'warn' },
  { label: 'logs.status.error', value: 'error' },
];
export const eventType = [
  { label: 'logs.eventType.sourcePull', value: 'source_pull_request' },
  { label: 'logs.eventType.sourcePush', value: 'source_push' },
  { label: 'logs.eventType.sourcePrePush', value: 'source_pre_push' },
  { label: 'logs.eventType.sourceSchedule', value: 'resource_schedule' },
  { label: 'logs.eventType.packagePush', value: 'package_push' },
  { label: 'logs.eventType.packagePull', value: 'package_pull' },
  { label: 'logs.eventType.sourceManual', value: 'resource_manual' },
  { label: 'logs.eventType.cliscan', value: 'cli_scan' },
];

export const riskLevelList = [
  { label: 'logs.risk.high', value: 1 },
  { label: 'logs.risk.middle', value: 2 },
  { label: 'logs.risk.low', value: 3 },
];
export default {
  statusList,
  riskLevelList,
};
