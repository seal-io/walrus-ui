import dayjs from 'dayjs';
import _ from 'lodash';
import { MoreAction } from '@/views/config/interface';

export const dateFormatMap = {
  day: 'YYYY.MM.DD',
  week: 'YYYY.MM.DD',
  month: 'YYYY.MM',
  year: 'YYYY'
};

export const ResourceSaveAction = {
  Draft: 'draft',
  Deploy: 'deploy',
  Preview: 'preview'
};

export const InjectCompleteDataKey = Symbol('InjectCompleteDataKey');

export const InjectProjectEnvironmentKey = Symbol(
  'InjectProjectEnvironmentKey'
);

export const InjectShowInputHintKey = Symbol('InjectShowInputHintKey');

export const InjectSchemaFormStatusKey = Symbol('InjectSchemaFormStatusKey');

export const InjectSchemaCustomMetaKey = Symbol('InjectSchemaCustomMeta');

export const InjectSchemaValidationTypeKey = Symbol(
  'InjectSchemaValidationTypeKey'
);

export const InjectTraceKey = Symbol('InjectTraceKey');

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
// can contain up to 30 characters
// Contains only lowercase alphanumeric characters or "-"
// starts with an alphanumeric character
// end with an alphanumeric character

export const validateLabelNameRegx = /^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])?$/;

export const validateLabelNameRegxFor63 =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

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
  LARGE: 600,
  XLARGE: 800
};

export const validateInputLength = {
  NAME: 30,
  TemplateName: 63,
  DESC: 200
};

export const TabPage = {
  PROJECTTAB: 'projectTab',
  ENVIRONMENTTAB: 'environmentTab',
  COSTTAB: 'costTab',
  OPERATORHUBTAB: 'operatorHubTab',
  SETTINGSTAB: 'settingsTab',
  USERTAB: 'userTab',
  PIPELINETAB: 'pipelineTab',
  RESOURCEDETAILTAB: 'resourceDetailTab',
  DEFINITIONDETAILTAB: 'definitionDetailTab'
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
  VARIABLES: 'variables',
  SETTINGS: 'settings'
};

export const ResourceDetailTabs = {
  OVERVIEW: 'overview',
  COMPONENTS: 'components',
  OUTPUTS: 'outputs',
  ENDPOINTS: 'endpoints',
  REVISIONS: 'revisions',
  SETTINGS: 'settings'
};

export const DefinitionDetailTabs = {
  RULES: 'rules',
  INPUTS: 'inputs',
  OUTPUTS: 'outputs',
  UISCHEMA: 'uiSchema',
  DEFINITIONRESOURCES: 'definitionResources'
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
  Definition: [
    {
      'zh-CN':
        'https://seal-io.github.io/docs/zh/operation/resource-definition',
      'en-US': 'https://seal-io.github.io/docs/operation/resource-definition'
    }
  ],
  DefinitionSchema: [
    {
      'zh-CN':
        'https://seal-io.github.io/docs/zh/operation/resource-definition#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%B5%84%E6%BA%90%E5%AE%9A%E4%B9%89%E7%9A%84-ui-%E6%A8%A1%E5%BC%8F',
      'en-US':
        'https://seal-io.github.io/docs/operation/resource-definition#resource-definition-schema'
    }
  ],
  UISchema: [
    {
      'zh-CN':
        'https://seal-io.github.io/docs/zh/operation/template#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF-ui-%E6%A0%B7%E5%BC%8F',
      'en-US':
        'https://seal-io.github.io/docs/operation/template#customizing-template-ui-styles'
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

export const EnvironmentTypeList = [
  {
    label: 'common.environment.development',
    value: 'development'
  },
  {
    label: 'common.environment.staging',
    value: 'staging'
  },
  {
    label: 'common.environment.production',
    value: 'production'
  }
];
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
    value: ResourceSaveAction.Deploy,
    icon: 'icon-sendfasong',
    iconfont: true
  },
  {
    label: 'common.button.savePreview',
    value: ResourceSaveAction.Preview,
    icon: 'icon-Cloud',
    iconfont: true
  },
  {
    label: 'common.button.draft',
    value: ResourceSaveAction.Draft,
    icon: 'icon-xiangqing',
    iconfont: true
  }
];

export const HintKeyMaps = {
  resource: 'res',
  var: 'var',
  service: 'svc',
  workflow: 'workflow'
};

export const StatusColorValueMap = {
  error: '--red-6',
  warningColor: '--warning-6',
  warningBg: '--warning-3',
  success: '--green-6',
  inactiveColor: '--gray-6',
  inactiveBg: '--gray-4'
};

export const StatusDarkColorValueMap = {
  error: '225,105,101',
  warningColor: '236,150,38',
  warningBg: '210,141,31',
  success: '39, 160, 70',
  inactiveColor: '146,146,147',
  inactiveBg: '95,95,96'
};

export const StatusLightColorValueMap = {
  error: '245, 63, 63',
  warningColor: '255,125,0',
  warningBg: '255,207,139',
  success: '0,191,114',
  inactiveColor: '134,144,156',
  inactiveBg: '201,205,212'
};

export const StatusColorBgMap = {
  ready: `rgba(var(${StatusColorValueMap.success}),0.7)`,
  error: `rgba(var(${StatusColorValueMap.error}),0.7)`,
  transitioning: `rgba(var(${StatusColorValueMap.warningBg}))`,
  inactive: `rgba(var(${StatusColorValueMap.inactiveBg}),1)`
};

export const StatusDarkColorBgMap = {
  ready: `rgba(${StatusDarkColorValueMap.success},0.7)`,
  error: `rgba(${StatusDarkColorValueMap.error},0.7)`,
  transitioning: `rgba(${StatusDarkColorValueMap.warningBg})`,
  inactive: `rgba(${StatusDarkColorValueMap.inactiveBg},1)`
};

export const StatusLightColorBgMap = {
  ready: `rgba(${StatusLightColorValueMap.success},0.7)`,
  error: `rgba(${StatusLightColorValueMap.error},0.7)`,
  transitioning: `rgba(${StatusLightColorValueMap.warningBg})`,
  inactive: `rgba(${StatusLightColorValueMap.inactiveBg},1)`
};
// color1: background color; color5: font color
export const StatusColor = {
  error: {
    text: `rgba(var(${StatusColorValueMap.error}), 0.8)`,
    bg: `rgba(var(${StatusColorValueMap.error}), 0.1)`,
    icon: 'icon-close-circle-fill'
  },
  warning: {
    text: `rgba(var(${StatusColorValueMap.warningColor}))`, // color
    bg: `rgba(var(${StatusColorValueMap.warningBg}),0.3)`, // backgroundColor #f9cc45
    icon: ''
  },
  success: {
    text: `rgba(var(${StatusColorValueMap.success}), 0.9)`,
    bg: `rgba(var(${StatusColorValueMap.success}), 0.1)`,
    icon: 'icon-check-circle-fill'
  },
  inactive: {
    text: `rgba(var(${StatusColorValueMap.inactiveColor}), 1)`,
    bg: `rgba(var(${StatusColorValueMap.inactiveBg}), 0.3)`,
    icon: 'icon-minus-circle-fill'
  }
};

export const StatusDarkColor = {
  error: {
    text: `rgba(${StatusDarkColorValueMap.error}, 0.8)`,
    bg: `rgba(${StatusDarkColorValueMap.error}, 0.1)`,
    icon: ''
  },
  warning: {
    text: `rgba(${StatusDarkColorValueMap.warningColor})`, // color
    bg: `rgba(${StatusDarkColorValueMap.warningBg},0.3)`, // backgroundColor #f9cc45
    icon: ''
  },
  success: {
    text: `rgba(${StatusDarkColorValueMap.success}, 0.9)`,
    bg: `rgba(${StatusDarkColorValueMap.success}, 0.1)`,
    icon: ''
  },
  inactive: {
    text: `rgba(${StatusDarkColorValueMap.inactiveColor}, 1)`,
    bg: `rgba(${StatusDarkColorValueMap.inactiveBg}, 0.3)`,
    icon: ''
  }
};

export const StatusLightColor = {
  error: {
    text: `rgba(${StatusLightColorValueMap.error}, 0.8)`,
    bg: `rgba(${StatusLightColorValueMap.error}, 0.1)`,
    icon: ''
  },
  warning: {
    text: `rgba(${StatusLightColorValueMap.warningColor})`, // color
    bg: `rgba(${StatusLightColorValueMap.warningBg},0.3)`, // backgroundColor #f9cc45
    icon: ''
  },
  success: {
    text: `rgba(${StatusLightColorValueMap.success}, 0.9)`,
    bg: `rgba(${StatusLightColorValueMap.success}, 0.1)`,
    icon: ''
  },
  inactive: {
    text: `rgba(${StatusLightColorValueMap.inactiveColor}, 1)`,
    bg: `rgba(${StatusLightColorValueMap.inactiveBg}, 0.3)`,
    icon: ''
  }
};

export const pageLevelMap = {
  Project: 'Project',
  Environment: 'Environment',
  Service: 'Service',
  Pipeline: 'Pipeline',
  PipelineExcutions: 'PipelineExcutions'
};

export default {};
