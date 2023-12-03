import _, { get } from 'lodash';
import dayjs from 'dayjs';
import { MoreAction } from '@/views/config/interface';
import { Resources, Actions } from '@/permissions/config';
import { setDurationValue } from '@/views/config/utils';
import { useUserStore } from '@/store';

const userStore = useUserStore();
export const ProvideServiceIDKey = Symbol('ProvideServiceIDKey');
export const ProvideSetServiceInfoKey = Symbol('ProvideSetServiceInfoKey');
export const ProvideServiceInfoKey = Symbol('ProvideServiceInfoKey');
export const ServiceDataType = {
  service: 'service',
  resource: 'resource'
};
export const instanceTabs = [
  {
    label: 'applications.instance.tab.resource',
    value: 'resource',
    com: 'tabResource',
    requiredAuth: true,
    permission: ['GET']
  },
  {
    label: 'applications.instance.tab.output',
    value: 'outputs',
    requiredAuth: false,
    com: 'tabOutput'
  }
];

export const moduleActions = [
  { label: 'common.button.edit', value: 'edit', icon: 'icon-edit' },
  { label: 'common.button.delete', value: 'delete', icon: 'icon-delete' }
];

export const variablesTypeList = [{ label: 'string', value: 'string' }];

export const serviceStatus = [
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
export enum Status {
  Warning = 'warning',
  Error = 'error',
  Running = 'running'
}
export const setServiceStatus = (status) => {
  if (get(status, 'transitioning')) return Status.Warning;
  if (get(status, 'error')) return Status.Error;
  return Status.Running;
};

export const serviceBasicInfo = [
  { label: 'applications.projects.form.label', value: '', key: 'labels' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'common.table.description',
    value: '',
    key: 'description'
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

export const CreatActions = [
  {
    label: 'applications.applications.table.service',
    value: ServiceDataType.service,
    icon: 'icon-fuwu'
  },
  {
    label: 'applications.applications.table.resource',
    value: ServiceDataType.resource,
    icon: 'icon-shengchenglujing-01'
  }
];
export const RevisionStatus = {
  Succeeded: 'Succeeded',
  Running: 'Running',
  Failed: 'Failed'
};

export const ServiceStatus = {
  Deployed: 'Deployed',
  Ready: 'Ready',
  NotReady: 'NotReady',
  Deleting: 'Deleting',
  Deploying: 'Deploying',
  Preparing: 'Preparing',
  Running: 'Running',
  DeployFailed: 'DeployFailed',
  DeleteFailed: 'DeleteFailed',
  Stopped: 'Stopped',
  Undeployed: 'Undeployed',
  StopFailed: 'StopFailed',
  Stopping: 'Stopping'
};

export const StartableStatus = [
  ServiceStatus.Stopped,
  ServiceStatus.Undeployed
];

export const StoppableStatus = [
  ServiceStatus.Deployed,
  ServiceStatus.Ready,
  ServiceStatus.NotReady,
  ServiceStatus.Preparing,
  ServiceStatus.Running
];

// export const NonStartableStatus = [
//   ServiceStatus.Deleting,
//   ServiceStatus.DeleteFailed,
//   ServiceStatus.Deployed,
//   ServiceStatus.Deploying,
//   ServiceStatus.Preparing,
//   ServiceStatus.Running
// ];

// export const NonStoppableStatus = [
//   ServiceStatus.Deleting,
//   ServiceStatus.DeleteFailed,
//   ServiceStatus.Stopped,
//   ServiceStatus.Undeployed
// ];

export const componentsMap = {
  string: 'Input',
  number: 'InputNumber',
  bool: 'Checkbox',
  dynamic: 'AceEditor'
};

export const instanceUpgradeView = [
  { label: 'common.table.name', value: '', key: 'name' },
  {
    label: 'applications.applications.detail.env',
    value: '',
    key: 'environment.id'
  }
];

export const serviceActionMap = {
  upgrade: 'upgrade',
  logs: 'logs',
  rollback: 'rollback',
  delete: 'delete',
  sync: 'sync',
  stop: 'stop',
  start: 'start'
};

export const serviceActions: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: serviceActionMap.upgrade,
    icon: 'icon-edit',
    handler: '',
    status: 'normal',
    disabled(currentInfo: any): boolean {
      if (
        get(currentInfo, 'status.transitioning') &&
        get(currentInfo, 'status.summaryStatus') !== ServiceStatus.Preparing
      ) {
        return true;
      }
      return false;
    },
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Services,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.stop',
    value: serviceActionMap.stop,
    icon: 'icon-record-stop',
    handler: '',
    status: 'normal',
    disabled(currentInfo: any): boolean {
      return !_.includes(
        StoppableStatus,
        get(currentInfo, 'status.summaryStatus')
      );
    },
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Services,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'common.button.start',
    value: serviceActionMap.start,
    icon: 'icon-play-circle',
    handler: '',
    status: 'normal',
    disabled(currentInfo: any): boolean {
      return !_.includes(
        StartableStatus,
        get(currentInfo, 'status.summaryStatus')
      );
    },
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Services,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'applications.applications.history.running',
    value: serviceActionMap.logs,
    icon: 'icon-rizhi',
    iconfont: true,
    handler: '',
    status: 'normal'
  },
  {
    label: 'common.button.rollback',
    value: serviceActionMap.rollback,
    icon: 'icon-rollback-copy',
    iconfont: true,
    handler: '',
    status: 'normal',
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Services,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.delete',
    value: serviceActionMap.delete,
    icon: 'icon-delete',
    handler: '',
    status: 'danger',
    disabled(currentInfo) {
      return (
        get(currentInfo, 'status.summaryStatus') === ServiceStatus.Deleting
      );
    },
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Services,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.DELETE]
      });
    }
  }
];
export default {};
