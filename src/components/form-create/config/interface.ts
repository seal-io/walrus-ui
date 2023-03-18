import { FieldRule } from '@arco-design/web-vue';

export interface LabelListItem {
  key?: string;
  label?: string;
  value: string | number;
}

export interface ComponentSchema {
  Name: string;
  Type: string;
  Default: any;
  ShowCondition: { key: string; value: string };
  parentCom: string;
  childCom: string;
  Required: boolean;
  Sensitive: boolean;
  Description: string;
  ShowIf?: string;
  order?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  Options?: { label: string; value: string }[];
  Label?: string;
  Group?: string;
  props?: object;
  rules?: FieldRule[];
  labelList?: LabelListItem[];
}
// replace input width hintInput
export const parseComponentSchema = (schema: ComponentSchema) => {
  const props = {
    min: schema?.min || null,
    max: schema?.max || null,
    maxLength: schema?.maxLength || 100,
    showWordLimit: schema?.maxLength,
    minLength: schema?.minLength || null
  };
  // string
  if (schema.Type === 'string' || schema.Type === 'number') {
    // =============Select======================
    if (schema?.Options?.length) {
      return {
        component: ['Select', 'Option'],
        props: {
          ...props
        },
        rules: [
          { required: schema.Required, message: 'common.form.rule.select' }
        ]
      };
    }

    //  ===========InputPassword============
    if (schema.Sensitive && schema.Type === 'string') {
      return {
        component: ['hintInput'],
        props: {
          ...props
        },
        rules: [
          { required: schema.Required, message: 'common.form.rule.input' }
        ]
      };
    }
    // =============InputeNmber==========
    if (schema.Type === 'number') {
      return {
        component: ['InputNumber'],
        props: {
          ...props
        },
        rules: [
          { required: schema.Required, message: 'common.form.rule.input' }
        ]
      };
    }
    //  ============Input===========
    if (!schema.Sensitive && schema.Type === 'string') {
      return {
        component: ['hintInput'],
        props: { ...props },
        rules: [
          { required: schema.Required, message: 'common.form.rule.input' }
        ]
      };
    }
  }

  // =====Input group==============
  if (schema.Type === 'map(string)') {
    return {
      component: ['XInputGroup'],
      props: { ...props },
      rules: [{ required: schema.Required, message: 'common.form.rule.input' }]
    };
  }
  // ====== select ======
  if (schema.Type === 'list(number)' || schema.Type === 'list(string)') {
    return {
      component: ['Select', 'Option'],
      props: {
        ...props,
        multiple: true,
        allowCreate: !schema.Options?.length
      },
      rules: [{ required: schema.Required, message: 'common.form.rule.select' }]
    };
  }
  // boolean
  if (schema.Type === 'bool') {
    // ================Checkbox================
    return {
      component: ['Checkbox'],
      props: { ...props },
      rules: [{ required: schema.Required, message: 'common.form.rule.select' }]
    };
  }
  return {
    component: ['hintInput'],
    props: { ...props },
    rules: [{ required: schema.Required, message: 'common.form.rule.input' }]
  };
};

export default {};
