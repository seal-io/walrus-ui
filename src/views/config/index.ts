import dayjs from 'dayjs';
import _ from 'lodash';
import { MoreAction } from '@/views/config/interface';

export const dateFormatMap = {
  day: 'YYYY.MM.DD',
  week: 'YYYY.MM.DD',
  month: 'YYYY.MM',
  year: 'YYYY'
};

export const InjectCompleteDataKey = Symbol('InjectCompleteDataKey');

export const InjectProjectEnvironmentKey = Symbol(
  'InjectProjectEnvironmentKey'
);

export const InjectShowInputHintKey = Symbol('InjectShowInputHintKey');

export const InjectSchemaFormEditableKey = Symbol(
  'InjectSchemaFormEditableKey'
);

export const setEndTimeAddDay = (time, mode) => {
  if (mode === 'utc') {
    return dayjs(time).add(1, 'day').format('YYYY-MM-DDT00:00:00+00:00');
  }
  return dayjs(time).hour(0).minute(0).second(0).add(1, 'day').format();
};

export const websocketEventType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};
// can contain up to 63 characters
// Contains only lowercase alphanumeric characters or "-"
// starts with an alphanumeric character
// end with an alphanumeric character

export const validateLabelNameRegx = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

// up to 39 characters
// Can only contain alphanumeric, _, -
// cannot have consecutive -, _
// and cannot start or end with - or _

export const validateUserNameRegx =
  /^[a-zA-Z0-9]([a-zA-Z0-9_-]{0,37}[a-zA-Z0-9])?$/;
// page state
export enum PageAction {
  EDIT = 'edit',
  VIEW = 'view',
  CREATE = 'create'
}

export enum ModalAction {
  EDIT = 'edit',
  CREATE = 'create',
  VIEW = 'view'
}

export const InputWidth = {
  DEFAULT: 360,
  MIDDLE: 474,
  LARGE: 500,
  XLARGE: 800
};

export const TabPage = {
  PROJECTTAB: 'projectTab',
  ENVIRONMENTTAB: 'environmentTab',
  COSTTAB: 'costTab',
  OPERATORHUBTAB: 'operatorHubTab',
  SETTINGSTAB: 'settingsTab',
  USERTAB: 'userTab',
  PIPELINETAB: 'pipelineTab'
};

export const ProjectTabs = {
  ENVIRONMENT: 'environments',
  CONNECTOR: 'connectors',
  MEMBER: 'members',
  VARIABLES: 'variables',
  TEMPLATES: 'templates',
  CATALOGS: 'catalogs',
  WORKFLOW: 'workflow'
};

export const PipelineTabs = {
  LATESTRUN: 'latestRun',
  HISTORY: 'history'
};

export const EnvironmentTabs = {
  SERVICE: 'services',
  GRAPH: 'graph',
  VARIABLES: 'variables'
};

export const CostTabs = {
  LIST: 'list',
  DETAIL: 'detail'
};

export const OperatorHubTabs = {
  TEMPLATES: 'templates',
  VARIABLES: 'variables',
  CONNECTOR: 'connectors',
  CATALOGS: 'catalogs',
  ResouceDefinitions: 'resourceDefinitions'
};

export const UserTabs = {
  USERS: 'info',
  PASSWORD: 'password',
  TOKENS: 'tokens'
};

export const QAlinkMap = {
  Project: [
    {
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/project',
      'en-US': 'https://seal-io.github.io/docs/application/project'
    }
  ],
  ProjectDetail: [
    {
      'label': 'menu.operatorHub.evniroment',
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/environment',
      'en-US': 'https://seal-io.github.io/docs/application/environment'
    },
    {
      'label': 'menu.applicationManagement.secret',
      'zh-CN': 'https://seal-io.github.io/docs/zh/operation/variable',
      'en-US': 'https://seal-io.github.io/docs/operation/variable'
    },
    {
      'label': 'menu.operatorHub.connector',
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/connector',
      'en-US': 'https://seal-io.github.io/docs/application/connector'
    },
    {
      'label': 'menu.applicationManagement.members',
      'zh-CN':
        'https://seal-io.github.io/docs/zh/application/project#%E6%88%90%E5%91%98%E7%AE%A1%E7%90%86',
      'en-US':
        'https://seal-io.github.io/docs/application/project#member-management'
    }
  ],
  Environment: [
    {
      'label': 'menu.applicationManagement.serivce',
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/service',
      'en-US': 'https://seal-io.github.io/docs/application/service'
    },
    {
      'label': 'applications.instance.tab.graph',
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/graph',
      'en-US': 'https://seal-io.github.io/docs/application/graph'
    }
  ],
  Cost: [
    {
      'zh-CN': 'https://seal-io.github.io/docs/zh/application/cost',
      'en-US': 'https://seal-io.github.io/docs/application/cost'
    }
  ],
  Template: [
    {
      'zh-CN': 'https://seal-io.github.io/docs/zh/operation/template',
      'en-US': 'https://seal-io.github.io/docs/operation/template'
    }
  ],
  Settings: [
    {
      'zh-CN': 'https://seal-io.github.io/docs/zh/setting',
      'en-US': 'https://seal-io.github.io/docs/setting'
    }
  ],
  Users: [
    {
      'zh-CN': 'https://seal-io.github.io/docs/zh/setting/user',
      'en-US': 'https://seal-io.github.io/docs/setting/user'
    }
  ]
};
export const USER_DEFAULT_PROJECT = 'USER_DEFAULT_PROJECT';

export const EnvironmentTypeMap = {
  development: 'common.environment.development',
  production: 'common.environment.production',
  staging: 'common.environment.staging'
};

export const EnvironmentTypeOrder = {
  development: 1,
  production: 3,
  staging: 2
};

export const CommonButtonValue = {
  Edit: 'edit',
  View: 'view',
  Update: `update`,
  Delete: 'delete',
  Create: 'create',
  Save: 'save',
  Cancel: 'cancel',
  Clone: 'clone',
  Stop: 'stop',
  Start: 'start'
};

export const SaveActions: MoreAction[] = [
  {
    label: 'common.button.saveDeploy',
    value: 'deploy',
    icon: 'icon-Cloud',
    iconfont: true
  },
  {
    label: 'common.button.draft',
    value: 'draft',
    icon: 'icon-xiangqing',
    iconfont: true
  }
];

export default {};
