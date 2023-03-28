import { filter, map, get, split } from 'lodash';
import dayjs from 'dayjs';
import { KeysItem, InstanceResource, Cascader } from './interface';

export const instanceTabs = [
  // { label: '配置定义', value: 'configuration', com: 'tabConfiguration' },
  { label: '资源', value: 'resource', com: 'tabResource' },
  // { label: '入口', value: 'endpoint', com: 'tabEndpoint' },
  { label: '日志', value: 'logs', com: 'tabLogs' },
  // { label: '输出', value: 'outputs', com: 'tabOutput' },
  // { label: '优化建议', value: 'optimization', com: 'tabOptimization' },
  // { label: '关联图', value: 'graph', com: 'tabGraph' },
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
export const setDurationValue = (val) => {
  if (!val) return '-';
  const seconds = val % 60;
  const min = Math.floor(val / 60);
  return `${min}'${seconds}"`;
};
export const instanceBasicInfo = [
  { label: '名称', value: '', key: 'name' },
  { label: '状态', value: '', key: 'status' },
  { label: '应用', value: '', key: 'application.name' },
  { label: '环境', value: '', key: 'environment.name' },
  {
    label: '创建时间',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];
export const revisionDetailConfig = [
  {
    label: '创建日期',
    key: 'createTime',
    value: '',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: '状态',
    key: 'status',
    value: ''
  },
  {
    label: '部署时长',
    key: 'duration',
    value: '',
    formatter(val) {
      return setDurationValue(val);
    }
  }
];
export const generateResourcesKeys = (reources: InstanceResource[], type) => {
  const loop = (keysItem: KeysItem, id) => {
    let list: KeysItem[] = keysItem.keys || [];
    if (type === 'loggable') {
      list = filter(list, (s) => s.loggable) as KeysItem[];
    }
    if (type === 'executable') {
      list = filter(list, (s) => s.executable) as KeysItem[];
    }
    if (!list.length) return null;
    const resultList = map(list, (item) => {
      return {
        loggable: item.loggable,
        executable: item.executable,
        label: item.name,
        value: `${item.value || item.name}?id=${id}`,
        children: loop(item, id)
      };
    });
    return resultList;
  };
  const list = map(reources, (o) => {
    const item = {
      label: o.name,
      value: o.name,
      children: map(get(o, 'keys.keys') || [], (s) => {
        return {
          label: s.name,
          value: `${s.type || s.name}?id=${o.id}`,
          loggable: s.loggable,
          executable: s.executable,
          children: loop(s, o.id)
        };
      })
    };
    return item;
  });
  const res = filter(list, (o) => o?.children?.length) as never[];
  return res;
};

export const getResourceId = (val) => {
  const res = split(val, '?');
  const d = get(res, 1);
  return {
    key: get(res, 0),
    id: get(split(d, '='), 1)
  };
};

export const getDefaultValue = (list: Cascader[]) => {
  const data: Cascader = get(list, '0') || {};
  const loop = (obj: Cascader) => {
    if (!obj.children || !obj?.children?.length) {
      return obj.value;
    }
    return loop(get(obj, 'children.0'));
  };
  return loop(data);
};
export default {};
