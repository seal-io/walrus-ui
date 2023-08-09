import dayjs from 'dayjs';
import _, { each, get, sortBy, uniq } from 'lodash';

export const dateFormatMap = {
  day: 'YYYY.MM.DD',
  week: 'YYYY.MM.DD',
  month: 'YYYY.MM',
  year: 'YYYY'
};

export const setEndTimeAddDay = (time, mode) => {
  if (mode === 'utc') {
    return dayjs(time).add(1, 'day').format('YYYY-MM-DDT00:00:00+00:00');
  }
  return dayjs(time).hour(0).minute(0).second(0).add(1, 'day').format();
};

export const websocketEventType = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3
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
  VIEW = 'view'
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

export const QAlinkMap = {
  Project: 'https://seal-io.github.io/docs/application/project',
  ProjectDetail: [
    {
      label: 'menu.operatorHub.evniroment',
      url: 'https://seal-io.github.io/docs/application/environment'
    },
    {
      label: 'menu.applicationManagement.secret',
      url: 'https://seal-io.github.io/docs/operation/variable'
    },
    {
      label: 'menu.operatorHub.connector',
      url: 'https://seal-io.github.io/docs/application/connector'
    },
    {
      label: 'menu.applicationManagement.members',
      url: 'https://seal-io.github.io/docs/application/project#%E6%88%90%E5%91%98%E7%AE%A1%E7%90%86'
    }
  ],
  Environment: [
    {
      label: 'menu.applicationManagement.serivce',
      url: 'https://seal-io.github.io/docs/application/service'
    },
    {
      label: 'applications.instance.tab.graph',
      url: 'https://seal-io.github.io/docs/application/graph'
    }
  ],
  Cost: 'https://seal-io.github.io/docs/category/%E6%88%90%E6%9C%AC%E4%B8%AD%E5%BF%83',
  Template: 'https://seal-io.github.io/docs/operation/template',
  Settings: 'https://seal-io.github.io/docs/setting/configuration',
  Users: 'https://seal-io.github.io/docs/setting/user'
};
export const USER_DEFAULT_PROJECT = 'USER_DEFAULT_PROJECT';

export default {};
