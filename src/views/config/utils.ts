import _, { reduce, each, get, sortBy, keys, uniq, map, uniqBy } from 'lodash';
import dayjs from 'dayjs';
import { dateFormatMap } from '@/views/config';
import { async } from '@antv/x6/lib/registry/marker/async';

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

export const setDurationValue = (val) => {
  // val: seconds
  if (!val) return '-';
  const day = Math.floor(val / 86400);
  let hour = Math.floor((val % 86400) / 3600);
  let minute = Math.floor(((val % 86400) % 3600) / 60);
  let second = Math.floor(((val % 86400) % 3600) % 60);
  if (hour < 10) {
    hour = Number(`0${hour}`);
  }

  if (minute < 10) {
    minute = Number(`0${minute}`);
  }

  if (second < 10) {
    second = Number(`0${second}`);
  }

  if (day) {
    return `${day}d ${hour}:${minute}:${second}`;
  }
  if (hour) {
    return `${hour}:${minute}:${second}`;
  }
  if (minute) {
    return `${minute}'${second}''`;
  }
  return `${second}''`;
};

export const handleBatchRequest = async (list, fn) => {
  return Promise.all(list.map((item) => fn(item)));
};

export default {};
