import { get } from 'lodash';
import dayjs from 'dayjs';

export const instanceTabs = [
  // { label: '配置定义', value: 'configuration', com: 'tabConfiguration' },
  {
    label: 'applications.instance.tab.resource',
    value: 'resource',
    com: 'tabResource'
  },
  // { label: '入口', value: 'endpoint', com: 'tabEndpoint' },
  { label: 'applications.instance.tab.log', value: 'logs', com: 'tabLogs' },
  {
    label: 'applications.instance.tab.output',
    value: 'outputs',
    com: 'tabOutput'
  },
  // { label: '优化建议', value: 'optimization', com: 'tabOptimization' },
  // { label: '关联图', value: 'graph', com: 'tabGraph' },
  // { label: '历史记录', value: 'history', com: 'tabHistory' },
  {
    label: 'applications.instance.tab.term',
    value: 'terminal',
    com: 'tabTerminal'
  }
];

export const reserveFields = [
  'source',
  'version',
  'providers',
  'count',
  'for_each',
  'lifecycle',
  'depends_on',
  'locals'
];
export const instanceActions = [
  {
    label: 'applications.applications.button.upgrade',
    value: 'upgrade',
    icon: 'icon-sync'
  },
  {
    label: 'common.button.clone',
    value: 'clone',
    icon: 'icon-font',
    props: {
      type: 'icon-Clone-Cloud'
    }
  },
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

export const variablesTypeList = [{ label: 'string', value: 'string' }];

export const instanceStatus = [
  { label: 'Deploying', value: 'Deploying' },
  { label: 'Deployed', value: 'Deployed' },
  { label: 'DeployFailed', value: 'DeployFailed' },
  { label: 'Deleting', value: 'Deleting' },
  { label: 'DeleteFailed', value: 'DeleteFailed' }
];

export const statusMap = {
  Deployed: 'running',
  Deleting: 'warning',
  Deploying: 'warning',
  DeployFailed: 'error',
  DeleteFailed: 'error'
};
export const setInstanceStatus = (status) => {
  if (get(status, 'transitioning')) return 'warning';
  if (get(status, 'error')) return 'error';
  return 'running';
};
export const websocketEventType = {
  create: 1,
  update: 2,
  delete: 3
};
export const setDurationValue = (val) => {
  if (!val) return '-';
  const seconds = val % 60;
  const min = Math.floor(val / 60);
  return `${min}'${seconds}"`;
};
export const instanceBasicInfo = [
  { label: 'applications.applications.form.name', value: '', key: 'name' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'applications.applications.detail.env',
    value: '',
    key: 'environment.name'
  },
  {
    label: 'applications.applications.instance.status',
    value: '',
    key: 'status'
  },
  {
    label: 'applications.applications.instance.application',
    value: '',
    key: 'application.name',
    span: 3
  }
];
export const applicationBasicInfo = [
  {
    label: 'applications.applications.form.name',
    key: 'name',
    value: '',
    editable: false,
    required: true,
    span: 1,
    form: 'input'
  },
  {
    label: 'common.table.createTime',
    key: 'createTime',
    value: '',
    span: 1,
    disabled: true,
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'common.table.description',
    key: 'description',
    value: '',
    span: 1,
    editable: false,
    form: 'textarea'
  },
  {
    label: 'common.table.updateTime',
    key: 'updateTime',
    value: '',
    span: 1,
    disabled: true,
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'applications.applications.form.label',
    key: 'labels',
    value: '',
    span: 1,
    editable: false
  }
];
export const revisionDetailConfig = [
  {
    label: 'applications.applications.history.deploymentTime',
    key: 'createTime',
    value: '',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'dashboard.table.status',
    key: 'status',
    value: ''
  },
  {
    label: 'dashboard.table.duration',
    key: 'duration',
    value: '',
    formatter(val) {
      return setDurationValue(val);
    }
  }
];

export const variableTypeList = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'bool', value: 'bool' },
  { label: 'dynamic', value: 'dynamic' }
];

export const RevisionStatus = {
  Succeeded: 'Succeeded',
  Running: 'Running',
  Failed: 'Failed'
};

export const AppInstanceStatus = {
  Deployed: 'Deployed',
  Deleting: 'Deleting',
  Deploying: 'Deploying',
  DeployFailed: 'DeployFailed',
  DeleteFailed: 'DeleteFailed'
};

export const componentsMap = {
  string: 'Input',
  number: 'InputNumber',
  bool: 'Checkbox',
  dynamic: 'AceEditor'
};
export default {};
