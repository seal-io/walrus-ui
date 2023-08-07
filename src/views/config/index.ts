import dayjs from 'dayjs';
import _, { reduce, each, get, sortBy, keys, uniq, map, uniqBy } from 'lodash';

export const dateFormatMap = {
  day: 'YYYY.MM.DD',
  week: 'YYYY.MM.DD',
  month: 'YYYY.MM',
  year: 'YYYY'
};
export const getStackLineDataList = (
  source: any[],
  obj: { fields: string[]; xAxis: string }
) => {
  type ItemType = { name: string; value: number[] };
  source = sortBy(source, (item) => item[obj.xAxis]);
  const dataList: ItemType[] = [];
  const xAxis: string[] = [];
  each(obj.fields, (key) => {
    const itemData: ItemType = {
      name: key,
      value: []
    };
    each(source, (item) => {
      itemData.value.push(item[key] || 0);
      xAxis.push(dayjs(get(item, obj.xAxis)).format('YYYY-MM-DD'));
    });
    dataList.push(itemData);
  });
  return { data: dataList, xAxis: uniq(xAxis) };
};

export const setEndTimeAddDay = (time, mode) => {
  if (mode === 'utc') {
    return dayjs(time).add(1, 'day').format('YYYY-MM-DDT00:00:00+00:00');
  }
  return dayjs(time).hour(0).minute(0).second(0).add(1, 'day').format();
};

/**
 *
 * @date 2023-03-22
 * @param {any} {list: source list
 * @param {any} key: data key
 * @param {any} xAxis}:
 */
export const getStackLineData = ({
  list,
  key = 'totalCost',
  fieldName = 'itemName',
  xAxis = 'startTime',
  step = 'day'
}: {
  list: object[];
  key?: string;
  fieldName?: string;
  xAxis?: string;
  step?: string;
}) => {
  const result = {
    bar: [],
    line: [] as any[],
    xAxis: [] as string[],
    dataConfig: [] as any[]
  };
  list = map(list || [], (s) => {
    s[key] = s[key] || 0;
    return s;
  });
  list = sortBy(list, (s) => s[xAxis]);
  const diffFieldName = uniqBy(list, (s) => s[fieldName]);
  // {[key]: {name: key, value: []}}
  const dataObj = reduce(
    diffFieldName,
    (obj, item) => {
      obj[get(item, fieldName)] = {
        name: get(item, fieldName),
        value: []
      };
      result.dataConfig.push({
        name: get(item, fieldName),
        label: get(item, fieldName)
      });
      return obj;
    },
    {}
  );
  // {'2023-03-22': {fieldName: ''}}
  const fielNameValueInxAixs = reduce(
    list,
    (obj, item) => {
      const xAxisVal = dayjs(item[xAxis]).format(get(dateFormatMap, step));
      result.xAxis.push(xAxisVal);
      const fieldNameVal = item[fieldName];
      if (obj[xAxisVal]) {
        if (!get(obj, `${xAxisVal}.${fieldNameVal}`)) {
          obj[xAxisVal][fieldNameVal] = item[key];
        }
      } else {
        obj[xAxisVal] = {};
        obj[xAxisVal][fieldNameVal] = item[key];
      }
      return obj;
    },
    {}
  );
  // ['2023-1','2023-1',...]
  const xAxisList = keys(fielNameValueInxAixs);
  each(diffFieldName, (p) => {
    const k = get(p, fieldName);
    each(xAxisList, (x) => {
      dataObj[k].value.push(get(fielNameValueInxAixs[x], `${k}`) || 0);
    });
  });

  each(diffFieldName, (sItem) => {
    result.line.push(get(dataObj, sItem[fieldName]));
  });
  result.xAxis = uniq(result.xAxis);
  return result;
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
  Settings: [
    {
      label: 'menu.systemsettings.user',
      url: 'https://seal-io.github.io/docs/setting/user'
    },
    {
      label: 'menu.systemsettings.config',
      url: 'https://seal-io.github.io/docs/setting/configuration'
    }
  ]
};
export const USER_DEFAULT_PROJECT = 'USER_DEFAULT_PROJECT';

export default {};
