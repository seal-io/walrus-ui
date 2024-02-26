import { MoreAction } from '@/views/config/interface';
import { useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import _ from 'lodash';

const userStore = useUserStore();
export const connectorTypeList = [
  {
    label: 'Kubernetes',
    enable: true,
    value: 'Kubernetes',
    com: 'kubernetes',
    route: 'ProjectConnectorK8sDetail',
    globalRoute: 'ConnectorK8sDetail',
    icon: 'icon-bxl-kubernetes',
    iconfont: true
  },
  {
    label: 'operation.connectors.reinstall.cloudProvider',
    enable: true,
    value: 'CloudProvider',
    com: 'cloud',
    route: 'ProjectConnectorProviderDetail',
    globalRoute: 'ConnectorProviderDetail',
    icon: 'icon-fill-cloud',
    iconfont: true
  },
  {
    label: 'operation.connectors.table.versioncontrol',
    enable: true,
    value: 'VersionControl',
    com: 'versionControl',
    route: 'ProjectConnectorScmDetail',
    globalRoute: 'ConnectorScmDetail',
    icon: 'icon-git',
    iconfont: true
  },
  {
    label: 'operation.connectors.reinstall.custom',
    enable: true,
    value: 'Custom',
    com: 'custom',
    route: 'ProjectConnectorCustomDetail',
    globalRoute: 'ConnectorCustomDetail',
    icon: 'icon-custom',
    iconfont: true
  }

  // { label: 'Cloud Provider', value: 'cloud', com: 'cloud' }
];

export const operationRootBread = {
  label: 'menu.operatorHub',
  icon: 'icon-relation',
  backAction: true,
  route: 'OperationMain'
};
export const ConnectorCategory = {
  VersionControl: 'VersionControl',
  Custom: 'Custom',
  CloudProvider: 'CloudProvider',
  Kubernetes: 'Kubernetes'
};

export const ConnectorType = {
  AWS: 'AWS',
  Alibaba: 'Alibaba',
  Kubernetes: 'Kubernetes',
  Github: 'Github'
};
export const CloudProviderType = {
  AWS: 'AWS',
  Alibaba: 'Alibaba',
  AzureRM: 'AzureRM',
  Google: 'Google'
};

export const inputFormatMap = {
  basic: 'basic',
  advanced: 'advanced'
};

export const CustomInputFormats = [
  { label: 'Basic', value: inputFormatMap.basic },
  { label: 'Advanced(JSON)', value: inputFormatMap.advanced }
];
export const cutomeTypeOptions = [
  { label: 'Alibaba', value: CloudProviderType.Alibaba },
  { label: 'AWS', value: CloudProviderType.AWS },
  { label: 'AzureRM', value: CloudProviderType.AzureRM },
  { label: 'Google', value: CloudProviderType.Google }
];

export const CommonCloudProviderKeys = [
  {
    label: 'AccessKey',
    value: '',
    key: 'access_key',
    visible: true,
    type: 'string'
  },
  {
    label: 'SecretKey',
    value: '',
    key: 'secret_key',
    visible: false,
    type: 'string'
  },
  {
    label: 'operation.connectors.table.region',
    value: '',
    key: 'region',
    visible: true,
    type: 'string'
  }
];

export const AzureRMCloudProviderKeys = [
  {
    label: 'ClientID',
    value: '',
    key: 'clientID',
    visible: true,
    type: 'string'
  },
  {
    label: 'ClientSecret',
    value: '',
    key: 'clientSecret',
    visible: false,
    type: 'string'
  },
  {
    label: 'SubscriptionID',
    value: '',
    key: 'subscriptionID',
    visible: true,
    type: 'string'
  },
  {
    label: 'TenantID',
    value: '',
    key: 'tenantID',
    visible: true,
    type: 'string'
  }
];

export const GoogleCloudProviderKeys = [
  {
    label: 'applications.projects.table.project',
    value: '',
    key: 'project',
    visible: true,
    type: 'string'
  },
  {
    label: 'operation.connectors.table.credentials',
    value: '',
    description: 'operation.connectors.table.credentials.desc',
    key: 'credentials',
    visible: false,
    type: 'string'
  },
  {
    label: 'operation.connectors.table.region',
    value: '',
    key: 'region',
    visible: true,
    type: 'string'
  },
  {
    label: 'operation.connectors.table.zones',
    value: '',
    key: 'zone',
    visible: true,
    type: 'string'
  }
];

export const finOpsStatus = [
  { label: 'operation.connectors.status.ready', value: 'ready' },
  { label: 'operation.connectors.status.error', value: 'error' }
];

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal',
    filterFun({ itemInfo, projectID }) {
      if (!ConnectorCategory[itemInfo.category]) {
        return false;
      }
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Connectors,
            projectID,
            actions: [Actions.PUT]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Connectors,
            actions: [Actions.PUT]
          });
    }
  },
  // {
  //   label: 'operation.connectors.table.enableFin',
  //   value: 'enableFinops',
  //   icon: 'icon-switch',
  //   iconfont: true,
  //   status: 'normal',
  //   filterFun({ itemInfo, projectID }) {
  //     const isKubernetes = itemInfo.category === ConnectorCategory.Kubernetes;
  //     return projectID
  //       ? userStore.hasProjectResourceActions({
  //           resource: Resources.Connectors,
  //           projectID,
  //           actions: [Actions.PUT]
  //         }) && isKubernetes
  //       : userStore.hasRolesActionsPermission({
  //           resource: Resources.Connectors,
  //           actions: [Actions.PUT]
  //         }) && isKubernetes;
  //   }
  // },
  // {
  //   label: 'operation.connectors.table.install',
  //   value: 'reinstall',
  //   icon: 'icon-install',
  //   iconfont: true,
  //   status: 'normal',
  //   filterFun({ itemInfo, projectID }) {
  //     const { enableFinOps } = itemInfo;
  //     return projectID
  //       ? userStore.hasProjectResourceActions({
  //           resource: Resources.Connectors,
  //           projectID,
  //           actions: [Actions.PUT]
  //         }) && enableFinOps
  //       : userStore.hasRolesActionsPermission({
  //           resource: Resources.Connectors,
  //           actions: [Actions.PUT]
  //         }) && enableFinOps;
  //   }
  // },
  // {
  //   label: 'operation.connectors.table.fetch',
  //   value: 'fetch',
  //   icon: 'icon-cloud-download',
  //   status: 'normal',
  //   filterFun({ itemInfo, projectID }) {
  //     const { enableFinOps } = itemInfo;
  //     return projectID
  //       ? userStore.hasProjectResourceActions({
  //           resource: Resources.Connectors,
  //           projectID,
  //           actions: [Actions.PUT]
  //         }) && enableFinOps
  //       : userStore.hasRolesActionsPermission({
  //           resource: Resources.Connectors,
  //           actions: [Actions.PUT]
  //         }) && enableFinOps;
  //   }
  // },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger',
    filterFun({ itemInfo, projectID }) {
      return projectID
        ? userStore.hasProjectResourceActions({
            resource: Resources.Connectors,
            projectID,
            actions: [Actions.DELETE]
          })
        : userStore.hasRolesActionsPermission({
            resource: Resources.Connectors,
            actions: [Actions.DELETE]
          });
    }
  }
];
export default {};
