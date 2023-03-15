import dayjs from 'dayjs';
import { reduce, each, get } from 'lodash';

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
  return { data: dataList, xAxis };
};

export const setEndTimeAddDay = (time, mode) => {
  if (mode === 'utc') {
    return dayjs(time).add(1, 'day').format('YYYY-MM-DDT00:00:00+00:00');
  }
  return dayjs(time).hour(0).minute(0).second(0).add(1, 'day').format();
};
