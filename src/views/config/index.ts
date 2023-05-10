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
  console.log('result=====', result, xAxisList);
  result.xAxis = uniq(result.xAxis);
  return result;
};

export const websocketEventType = {
  create: 1,
  update: 2,
  delete: 3
};
// project, appliation, instance, module
export const validateAppNameRegx = /^[a-z]([a-z0-9-]*[a-z0-9])?$/;

// secret
export const validateSecretNameRegx = /^(?![\d])[0-9A-Za-z_]+$/;

// environment
export const validateEvnNameRegx = /^[A-Za-z0-9]([A-Za-z0-9-_]*[A-Za-z0-9])?$/;

export default {};
