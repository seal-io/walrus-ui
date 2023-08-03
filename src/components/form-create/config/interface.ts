import _, { trim } from 'lodash';
import { FieldRule } from '@arco-design/web-vue';
import i18n from '@/locale';
import jsYaml from 'js-yaml';

export interface LabelListItem {
  key?: string;
  label?: string;
  value: string | number;
}

export interface ComponentSchema {
  name: string;
  type: string;
  default: any;
  showCondition: { key: string; value: string };
  conditions: Array<{
    variable: string;
    operator: string;
    value: string;
  }>;
  parentCom: string;
  childCom: string;
  required: boolean;
  sensitive: boolean;
  description: string;
  showIf?: string;
  order?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  isRequired?: string;
  options?: { label: string; value: string }[];
  label?: string;
  group?: string;
  subGroup?: string;
  mainGroup?: string;
  thirdGroup?: string;
  subGroupOrder?: number;
  thirdGroupOrder?: number;
  props?: object;
  rules?: FieldRule[];
  labelList?: LabelListItem[];
}
const BASIC_TYPE = ['number', 'string', 'bool'];

const UNKNOWN_TYPE = ['dynamic'];

const COLLECTION_TYPE = ['map', 'object', 'list', 'tuple'];

export const validateYaml = (str) => {
  let result: any = {};
  try {
    str = trim(str);
    const obj = jsYaml.load(str);
    if (!obj || !Object.keys(obj).length) {
      result = {
        empty: true,
        error: null
      };
    } else {
      result = {
        empty: false,
        error: null
      };
    }
  } catch (error: any) {
    result = {
      empty: false,
      error: {
        line: _.get(error, 'mark.line') + 1,
        reason: _.get(error, 'reason'),
        message: `${_.get(error, 'reason')} (line:${
          _.get(error, 'mark.line') + 1
        })`
      }
    };
  }
  return result;
};
export const schemaType = {
  isListPrimaryType(type) {
    return _.get(type, '0') === 'list';
  },
  isObjectPrimaryType(type) {
    return _.get(type, '0') === 'map' || _.get(type, '0') === 'object';
  },
  isTuplePrimaryType(type) {
    return _.get(type, '0') === 'tuple';
  },
  isBasicType(type) {
    return _.includes(BASIC_TYPE, type);
  },
  isUnknownType(type) {
    return _.includes(UNKNOWN_TYPE, type);
  },
  isCollectionType(type) {
    return _.get(type, '1') && !_.isString(_.get(type, '1'));
  },
  isStringType(type) {
    return type === 'string';
  },
  isNumberType(type) {
    return type === 'number';
  },
  isBoolenType(type) {
    return type === 'bool';
  },
  isMapString(type) {
    return _.get(type, '0') === 'map' && _.get(type, '1') === 'string';
  },
  isListString(type) {
    return _.get(type, '0') === 'list' && _.get(type, '1') === 'string';
  },
  isListNumber(type) {
    return _.get(type, '0') === 'list' && _.get(type, '1') === 'number';
  }
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
        component: ['hintInput'],
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
        component: ['hintInput'],
        props: { ...props },
        rules: [{ ...rules, message: 'common.form.rule.input' }]
      };
    }
  }

  // ========== Input group ==============
  if (schemaType.isMapString(type)) {
    return {
      component: ['XInputGroup'],
      props: { ...props, alwaysDelete: true },
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
  // ============ editor ============
  if (schemaType.isCollectionType(type) || schemaType.isUnknownType(type)) {
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
            if (!required) {
              callback();
            } else {
              const result = validateYaml(val);
              if (result?.empty) {
                callback(
                  `${schema.name}${i18n.global.t('common.form.rule.input')}`
                );
              } else if (!result.empty && result.error) {
                callback(`${result.error?.message}`);
              } else {
                callback();
              }
            }
          },
          message: 'common.form.rule.input'
        }
      ]
    };
  }
  return {
    component: ['hintInput'],
    props: { ...props },
    rules: [
      {
        ...rules,
        message: 'common.form.rule.input'
      }
    ]
  };
};

export default {};
