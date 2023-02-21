import { FieldRule } from '@arco-design/web-vue';

export interface ComponentSchema {
  Name: string;
  Type: string;
  Default: any;
  parentCom: string;
  childCom: string;
  Required: boolean;
  Sensitive: boolean;
  Description: string;
  ShowIf?: string;
  order?: number;
  Options?: string[];
  Label?: string;
  Group?: string;
  props?: object;
  rules?: FieldRule[];
}

export const parseComponentSchema = (schema: ComponentSchema) => {
  // string
  if (schema.Type === 'string' || schema.Type === 'number') {
    // =============Select======================
    if (schema?.Options?.length) {
      return {
        component: ['Select', 'Option'],
        props: {},
        rules: [
          { required: schema.Required, message: 'common.form.rule.select' }
        ]
      };
    }

    //  ===========InputPassword============
    if (schema.Sensitive) {
      return {
        component: ['InputPassword'],
        props: {},
        rules: [
          { required: schema.Required, message: 'common.form.rule.input' }
        ]
      };
    }

    //  ============Input===========
    if (!schema.Sensitive) {
      return {
        component: ['Input'],
        props: {},
        rules: [
          { required: schema.Required, message: 'common.form.rule.input' }
        ]
      };
    }
  }
  // boolean
  if (schema.Type === 'boolean') {
    // ================Checkbox================
    return {
      component: ['Checkbox'],
      props: {},
      rules: [{ required: schema.Required, message: 'common.form.rule.select' }]
    };
  }
  return {
    component: ['Input'],
    props: {},
    rules: [{ required: schema.Required, message: 'common.form.rule.input' }]
  };
};

export default {};
