import _, { get, map, keys, split, toString } from 'lodash';
import { LabelListItem, schemaType } from './interface';
import { isOrCondition } from './experssion-parser';

interface OptionsItem {
  label: string;
  value: string;
}

const operatorMap = {
  noequal: '!=',
  equal: '=',
  or: '||',
  and: '&&',
  gt: '>',
  lt: '<',
  lte: '<=',
  gte: '>='
};
const conditonOperator = [
  operatorMap.noequal,
  operatorMap.equal,
  operatorMap.or,
  operatorMap.and,
  operatorMap.gt,
  operatorMap.lt,
  operatorMap.lte,
  operatorMap.gte
];
const noequalFunc = (v1, v2) => {
  return !_.isEqual(v1, v2);
};

const orFunc = (b1, b2) => {
  return b1 || b2;
};

const andFunc = (b1, b2) => {
  return b1 && b2;
};
export const conditionFuncMap = () => {
  const funcMap = new Map();
  funcMap.set(operatorMap.noequal, noequalFunc);
  funcMap.set(operatorMap.or, orFunc);
  funcMap.set(operatorMap.and, andFunc);
  funcMap.set(operatorMap.equal, _.isEqual);
  funcMap.set(operatorMap.gt, _.gt);
  funcMap.set(operatorMap.lt, _.lt);
  funcMap.set(operatorMap.lte, _.lte);
  funcMap.set(operatorMap.gte, _.gte);
  return funcMap;
};
const funcMap = conditionFuncMap();

export const getConditionValue = (fm, formData) => {
  const conditionList = fm.conditions;
  if (isOrCondition(fm.showIf)) {
    return _.some(conditionList, (item) => {
      return funcMap.get(item.operator)(
        _.toString(_.get(formData, item.variable)),
        item.value
      );
    });
  }

  return _.every(conditionList, (item) => {
    return funcMap.get(item.operator)(
      _.toString(_.get(formData, item.variable)),
      item.value
    );
  });
};

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

export const parseCondition = (query) => {
  // if (query.indexOf(operatorMap.or) > -1) {
  // }
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
