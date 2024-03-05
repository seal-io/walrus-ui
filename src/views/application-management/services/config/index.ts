import _, { get } from 'lodash';
import dayjs from 'dayjs';
import { MoreAction } from '@/views/config/interface';
import { Resources, Actions } from '@/permissions/config';
import { setDurationValue } from '@/views/config/utils';
import { ResourceDetailTabs } from '@/views/config';
import { useUserStore } from '@/store';

const userStore = useUserStore();
export const ProvideServiceIDKey = Symbol('ProvideServiceIDKey');
export const ProvideSetServiceInfoKey = Symbol('ProvideSetServiceInfoKey');
export const ProvideServiceInfoKey = Symbol('ProvideServiceInfoKey');
export const ServiceDataType = {
  service: 'service',
  resource: 'resource'
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

export const instanceTabs = [
  {
    label: 'applications.instance.tab.resource',
    value: ResourceDetailTabs.COMPONENTS,
    com: 'tabResource',
    requiredAuth: true,
    permission: ['GET']
  },
  {
    label: 'applications.instance.tab.output',
    value: ResourceDetailTabs.OUTPUTS,
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
  Undeployed = 'undeployed',
  Stopped = 'stopped',
  Running = 'running'
}

export const setServiceStatus = (status) => {
  if (get(status, 'transitioning')) return Status.Warning;
  if (get(status, 'error')) return Status.Error;
  if (status?.summaryStatus === ServiceStatus.Undeployed) {
    return Status.Undeployed;
  }
  if (status?.summaryStatus === ServiceStatus.Stopped) {
    return Status.Stopped;
  }

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

export const latestRunConfig = [
  {
    label: 'dashboard.table.status',
    key: 'status',
    value: '',
    span: 1
  },
  {
    label: 'common.table.type',
    key: 'type',
    value: '',
    span: 1
  },
  {
    label: 'applications.applications.history.changes',
    key: 'componentChangeSummary',
    value: '',
    span: 1
  },
  {
    label: 'common.table.createdBy',
    key: 'createdBy',
    value: '',
    span: 1
  },
  {
    label: 'applications.applications.history.execTime',
    key: 'createTime',
    value: '',
    formatter(val) {
      return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    span: 1
  },
  {
    label: 'resource.revisons.table.duration',
    key: 'duration',
    value: '',
    formatter(val) {
      return setDurationValue(val);
    },
    span: 1
  },
  {
    label: 'common.table.mark',
    key: 'changeComment',
    value: '',
    span: 2
  }
];

export const runBasicConfig = [
  {
    label: 'ID',
    key: 'id',
    value: '',
    span: 1
  },
  {
    label: 'applications.applications.history.changes',
    key: 'componentChangeSummary',
    value: '',
    span: 1
  },
  {
    label: 'common.table.createdBy',
    key: 'createdBy',
    value: '',
    span: 1
  },
  {
    label: 'resource.revisons.table.duration',
    key: 'duration',
    value: '',
    formatter(val) {
      return setDurationValue(val);
    },
    span: 1
  },
  {
    label: 'common.table.mark',
    key: 'changeComment',
    value: '',
    span: 2
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
  Failed: 'Failed',
  Planned: 'Planned',
  Planning: 'Planning',
  Canceled: 'Canceled'
};

export const ApplicableStatus = [RevisionStatus.Planned];

export const RevisionWatchStatus = [
  RevisionStatus.Running,
  RevisionStatus.Planning
];

export const RevisionTypes = {
  create: 'create',
  update: 'update',
  delete: 'delete',
  start: 'start',
  stop: 'stop',
  rollback: 'rollback'
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
  preview: 'preview',
  delete: 'delete',
  clone: 'clone',
  deploy: 'deploy',
  import: 'import',
  export: 'export',
  sync: 'sync',
  stop: 'stop',
  start: 'start'
};

export const rollbackPreviewActions: MoreAction[] = [
  {
    label: 'common.button.rollback',
    value: serviceActionMap.rollback,
    icon: 'icon-Cloud',
    iconfont: true
  },
  {
    label: 'common.button.rollbackPreview',
    value: serviceActionMap.preview,
    icon: 'icon-Cloud',
    iconfont: true
  }
];

export const serviceBatchAction: MoreAction[] = [
  {
    label: 'common.button.deploy',
    value: serviceActionMap.deploy,
    icon: 'icon-sendfasong',
    iconfont: true,
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ projectID, environmentID }) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID,
        projectID,
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'common.button.clone',
    value: serviceActionMap.clone,
    icon: 'icon-Clone-Cloud',
    iconfont: true,
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ projectID, environmentID }) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID,
        projectID,
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'common.button.stop',
    value: serviceActionMap.stop,
    icon: 'icon-record-stop',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ projectID, environmentID }) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID,
        projectID,
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.start',
    value: serviceActionMap.start,
    icon: 'icon-play-circle',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ projectID, environmentID }) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID,
        projectID,
        actions: [Actions.PUT]
      });
    }
  },
  // {
  //   label: 'common.button.import',
  //   value: serviceActionMap.import,
  //   icon: 'icon-import',
  //   handler: '',
  //   status: 'normal',
  //   disabled(item) {
  //     return false;
  //   },
  //   filterFun({ projectID, environmentID }) {
  //     return userStore.hasProjectResourceActions({
  //       resource: Resources.Resources,
  //       environmentID,
  //       projectID,
  //       actions: [Actions.POST]
  //     });
  //   }
  // },
  {
    label: 'common.button.export',
    value: serviceActionMap.export,
    icon: 'icon-export',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ projectID, environmentID }) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID,
        projectID,
        actions: [Actions.POST]
      });
    }
  }
];

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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.deploy',
    value: serviceActionMap.deploy,
    icon: 'icon-sendfasong',
    iconfont: true,
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'common.button.clone',
    value: serviceActionMap.clone,
    icon: 'icon-Clone-Cloud',
    iconfont: true,
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
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
        resource: Resources.Resources,
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
      });
    }
  },
  {
    label: 'common.button.export',
    value: serviceActionMap.export,
    icon: 'icon-export',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Resources,
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
        resource: Resources.Resources,
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.DELETE]
      });
    }
  }
];

export const definitionResourceActions: MoreAction[] = [
  {
    label: 'common.button.deploy',
    value: serviceActionMap.deploy,
    icon: 'icon-sendfasong',
    iconfont: true,
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
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
        resource: Resources.Resources,
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.POST]
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
        resource: Resources.Resources,
        environmentID: get(currentInfo, 'environment.id'),
        projectID: get(currentInfo, 'project.id'),
        actions: [Actions.DELETE]
      });
    }
  }
];
export default {};
