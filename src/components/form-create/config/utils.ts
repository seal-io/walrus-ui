import { get, map, keys } from 'lodash';
import { LabelListItem } from './interface';

interface OptionsItem {
  label: string;
  value: string;
}
export const parseMapstring = (comSchema) => {
  let labelList: LabelListItem[] = [];
  const schemaType = get(comSchema, 'Type');
  if (schemaType === 'map(string)') {
    const defaultValue = keys(get(comSchema, 'Default') || {});
    if (defaultValue.length) {
      labelList = map(defaultValue, (k) => {
        return {
          key: k,
          value: get(comSchema, `Default.${k}`)
        };
      });
    } else {
      labelList = [{ key: '', value: '' }];
    }
  }
  return labelList;
};

export const parseOptions = (comSchema) => {
  const schemaType = get(comSchema, 'Type');
  let options: OptionsItem[] = [];
  if (['list(number)', 'list(string)'].includes(schemaType)) {
    const defaultValue =
      get(comSchema, 'Default') || get(comSchema, 'Options') || [];
    if (defaultValue.length) {
      options = map(defaultValue, (val) => {
        return {
          label: val,
          value: val
        };
      });
    } else {
      options = [];
    }
  }
  return options;
};
