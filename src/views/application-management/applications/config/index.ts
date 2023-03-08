export const instanceTabs = [
  // { label: '配置定义', value: 'configuration', com: 'tabConfiguration' },
  { label: '资源', value: 'resource', com: 'tabResource' },
  { label: '日志', value: 'logs', com: 'tabLogs' },
  { label: '输出', value: 'outputs', com: 'tabOutput' },
  { label: '优化建议', value: 'optimization', com: 'tabOptimization' },
  { label: '关联图', value: 'graph', com: 'tabGraph' },
  // { label: '历史记录', value: 'history', com: 'tabHistory' },
  { label: '终端', value: 'terminal', com: 'tabTerminal' }
];
export const createConfigOptions = [
  { label: 'webservice', value: 'webservice' },
  { label: '阿里云RDS', value: 'aliRds' },
  { label: 'S3', value: 's3' }
];
// instance configuration
export const instanceConfiguration = [
  { label: '用户密码', value: '1' },
  { label: 'SSH密码', value: '2' },
  { label: '无', value: '3' }
];

export const instanceActions = [
  // { label: 'common.button.edit', value: 'edit', icon: 'icon-edit' },
  { label: 'common.button.delete', value: 'delete', icon: 'icon-delete' }
  // {
  //   label: 'applications.applications.history.rollback',
  //   value: 'delete',
  //   icon: 'icon-undo'
  // }
];
export const moduleActions = [
  { label: 'common.button.edit', value: 'edit', icon: 'icon-edit' },
  { label: 'common.button.delete', value: 'delete', icon: 'icon-delete' }
];
export default {};
