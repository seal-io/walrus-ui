import dayjs from 'dayjs';
import {
  reduce,
  each,
  get,
  sortBy,
  keys,
  concat,
  cloneDeep,
  uniq,
  map,
  uniqBy
} from 'lodash';

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

// obj:{value: 'totalCost', name: 'itemName', xAxis: 'startTime'}
export const getStackLineChartDataList = (
  list: any[],
  config: { value: string; name: string; xAxis: string }
) => {
  type chartDataType = {
    xAxis: string[];
    line: Array<{ name: string; value: number[] }>;
    dataConfig: Array<{ name: string; label: string }>;
  };
  const chartData: chartDataType = {
    xAxis: [],
    line: [],
    dataConfig: []
  };
  list = sortBy(list, (s) => s[config.xAxis]);
  console.log('workload==1=2', list);
  list = sortBy(list, (d) => d.startTime);
  const dataObj = reduce(
    list,
    (obj, o) => {
      const item: any = {};
      each(keys(o), (key) => {
        if (key !== get(config, 'name')) {
          item[key] = [o[key]];
        } else {
          item[key] = o[key];
        }
      });
      if (get(obj, `${get(item, config.name)}`)) {
        each(keys(item), (k) => {
          if (k !== get(config, 'name')) {
            obj[item[get(config, 'name')]][k] = concat(
              get(obj, `${get(item, `${get(config, 'name')}`)}.${k}`),
              item[k]
            );
          }
        });
      } else {
        obj[get(item, config.name)] = cloneDeep(item);
      }
      return obj;
    },
    {}
  );

  each(keys(dataObj), (pKey) => {
    chartData.line.push({
      name: pKey,
      value: dataObj[pKey][config.value]
    });
    chartData.dataConfig.push({
      name: pKey,
      label: pKey
    });
    chartData.xAxis = dataObj[pKey][config.xAxis];
  });
  chartData.xAxis = map(chartData.xAxis, (kItem) => {
    return dayjs(kItem).format('YYYY.MM.DD');
  });
  return chartData;
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
