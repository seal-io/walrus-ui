import _, { get, map, keys, split, toString, trim } from 'lodash';
import i18n from '@/locale';
import { LabelListItem, ComponentSchema, OptionsItem } from './interface';
import { isOrCondition, parseExpression } from './experssion-parser';
import { validateYaml } from './yaml-parse';
import { schemaType } from './index';
import { setFieldDefaultValue } from '../../dynamic-form/config/field-type';

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

export const getObjectConditionValue = (fm, formData) => {
  const conditionList = parseExpression(fm.showIf);
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

export const isJSONstr = (str) => {
  let result = true;
  try {
    const obj = JSON.parse(str);
    if (typeof obj === 'object') {
      result = true;
    }
  } catch (error) {
    result = false;
  }
  return result;
};

export const json2Str = (obj) => {
  if (!obj || !Object.keys(obj).length) return '';
  return JSON.stringify(obj, null, 2);
};

export const str2Json = (str, type) => {
  str = trim(str);
  if (!str) {
    let res: any = [];
    if (schemaType.isListPrimaryType(type)) {
      res = [];
    } else if (schemaType.isObjectPrimaryType(type)) {
      res = {};
    } else if (schemaType.isTuplePrimaryType(type)) {
      res = [];
    }
    return res;
  }
  return JSON.parse(str);
};

export const unknowType = {
  dynamic: 'dynamic'
};

export const parseMapstring = (comSchema, val?) => {
  let labelList: LabelListItem[] = [];
  const type = get(comSchema, 'type');
  if (schemaType.isMapString(type)) {
    const value = val || get(comSchema, 'default') || {};
    const defaultValue = keys(value || {});
    if (defaultValue.length) {
      labelList = map(defaultValue, (k) => {
        return {
          key: k,
          value: get(value, `${k}`)
        };
      });
    }
  }
  return labelList;
};

export const parseFieldProperties = (fieldSchema): LabelListItem[] => {
  const properties = fieldSchema.properties || {};
  const keys = _.keys(properties) || [];
  if (!keys.length) return [];
  return _.map(keys, (key) => {
    return {
      key,
      value: setFieldDefaultValue(_.get(fieldSchema, `properties.${key}`)),
      type: _.get(fieldSchema, `properties.${key}.type`)
    };
  });
};

export const parseAdditionalPropertiesField = (fieldSchema, val?) => {
  let labelList: LabelListItem[] = [];
  if (fieldSchema.type === 'object' && fieldSchema.additionalProperties) {
    const value = val || get(fieldSchema, 'default') || {};
    const defaultValue = keys(value || {});
    if (defaultValue.length) {
      labelList = map(defaultValue, (k) => {
        return {
          key: k,
          value: get(value, `${k}`)
        };
      });
    } else {
      // properties
      labelList = parseFieldProperties(fieldSchema);
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

  const defaultValue =
    get(comSchema, 'options') ||
    get(comSchema, 'enum') ||
    get(comSchema, 'default') ||
    [];
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

// replace input width hintInput
export const parseComponentSchema = (schema: ComponentSchema) => {
  const props = {
    min: schema?.min || -Infinity,
    max: schema?.max || Infinity,
    maxLength: schema?.maxLength || 300,
    sensitive: schema?.sensitive,
    showWordLimit: schema?.maxLength,
    minLength: schema?.minLength || null
  };
  const { type, required, sensitive } = schema;

  const rules = { required };

  // ========= string ==============
  if (schemaType.isStringType(type) || schemaType.isNumberType(type)) {
    // =============Select======================
    if (schema?.options?.length) {
      return {
        component: ['Select', 'Option'],
        props: {
          ...props
        },
        rules: [{ ...rules, message: 'common.form.rule.select' }]
      };
    }

    //  ===========InputPassword============
    if (sensitive && schemaType.isStringType(type)) {
      return {
        component: ['HintInput'],
        props: {
          ...props
        },
        rules: [{ ...rules, message: 'common.form.rule.input' }]
      };
    }
    // =============InputeNmber==========
    if (schemaType.isNumberType(type)) {
      return {
        component: ['InputNumber'],
        props: {
          ...props
        },
        rules: [{ ...rules, message: 'common.form.rule.input' }]
      };
    }
    //  ============Input===========
    if (!sensitive && schemaType.isStringType(type)) {
      return {
        component: ['HintInput'],
        props: { ...props },
        rules: [{ ...rules, message: 'common.form.rule.input' }]
      };
    }
  }

  // ========== Input group ==============
  if (schemaType.isMapString(type)) {
    return {
      component: ['XInputGroup'],
      props: { ...props, alwaysDelete: true, shouldKey: true },
      rules: [{ ...rules, message: 'common.form.rule.input' }]
    };
  }
  // ============ select =============
  if (schemaType.isListNumber(type) || schemaType.isListString(type)) {
    return {
      component: ['Select', 'Option'],
      props: {
        ...props,
        multiple: true,
        allowCreate: !schema.options?.length
      },
      rules: [{ ...rules, message: 'common.form.rule.select' }]
    };
  }
  // ============ boolean ============
  if (schemaType.isBoolenType(type)) {
    // ================Checkbox================
    return {
      component: ['Checkbox'],
      props: { ...props },
      rules: [{ ...rules, message: 'common.form.rule.select' }]
    };
  }
  // ============ default ============ schemaType.isCollectionType(type) || schemaType.isUnknownType(type)
  return {
    component: ['AceEditor'],
    props: {
      ...props,
      lang: 'yaml',
      showGutter: true
    },
    rules: [
      {
        ...rules,
        validator(val, callback) {
          const result = validateYaml(val);
          if (result.error) {
            callback(`${result.error?.message}`);
          } else if (!required) {
            callback();
          } else if (result?.empty) {
            callback(
              `${schema.name}${i18n.global.t('common.form.rule.input')}`
            );
          } else {
            callback();
          }
        },
        message: ''
      }
    ]
  };
};

export const checkHasValue = (property) => {
  if (typeof property === 'undefined') {
    return false;
  }
  if (typeof property === 'object' && !Array.isArray(property)) {
    return _.keys(property).length !== 0;
  }
  if (Array.isArray(property)) {
    return property.length !== 0;
  }
  if (_.isBoolean(property)) {
    return property;
  }
  if (_.isNumber(property)) {
    return true;
  }
  return !!property;
};

export const XMLParser = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  return xmlDoc;
};

export const parseXMLFragment = (
  xmlFragment,
  options: { item: string; label: string; value: string }
) => {
  const result: Array<{ label: string; value: string }> = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlFragment, 'text/xml');
  const items = xmlDoc.querySelectorAll(options.item);
  items.forEach(function (item: any) {
    const label = item.querySelector(options.label).textContent;
    const value = item.querySelector(options.value).textContent;
    result.push({
      label,
      value
    });
  });
  return result;
};
