import { get, map, keys, split, toString } from 'lodash';
import { LabelListItem, schemaType } from './interface';

interface OptionsItem {
  label: string;
  value: string;
}
export const parseMapstring = (comSchema) => {
  let labelList: LabelListItem[] = [];
  const type = get(comSchema, 'type');
  if (schemaType.isMapString(type)) {
    const defaultValue = keys(get(comSchema, 'default') || {});
    if (defaultValue.length) {
      labelList = map(defaultValue, (k) => {
        return {
          key: k,
          value: get(comSchema, `default.${k}`)
        };
      });
    }
  }
  return labelList;
};
export const parseQuery = (query) => {
  const parsestr = split(query, '=');
  return {
    key: get(parsestr, '0'),
    value: toString(get(parsestr, '1'))
  };
};
export const parseOptions = (comSchema) => {
  const type = get(comSchema, 'type');
  let options: OptionsItem[] = [];
  // if (schemaType.isListNumber(type) || schemaType.isListString(type)) {
  //   const defaultValue =
  //     get(comSchema, 'options') || get(comSchema, 'default') || [];
  //   if (defaultValue.length) {
  //     options = map(defaultValue, (val) => {
  //       return {
  //         label: val,
  //         value: val
  //       };
  //     });
  //   } else {
  //     options = [];
  //   }
  // }
  const defaultValue =
    get(comSchema, 'options') || get(comSchema, 'default') || [];
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
  return options;
};
