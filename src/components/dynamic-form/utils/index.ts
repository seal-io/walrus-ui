import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../interface';
import ComponentsMap from '../components/components-map';

export const isSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  if (items && type === FIELD_TYPE.ARRAY) {
    return true;
  }
  return type === FIELD_TYPE.STRING && enumList && enumList.length > 0;
};

export const isNumber = (schema: FieldSchema) => {
  const { type } = schema;
  return type === FIELD_TYPE.INTEGER || type === FIELD_TYPE.NUMBER;
};

export const isPassword = (schema: FieldSchema) => {
  const { type } = schema;
  return type === FIELD_TYPE.STRING && schema.format === 'password';
};

export const isDatePicker = (schema: FieldSchema) => {
  const { type } = schema;
  return (
    type === FIELD_TYPE.STRING &&
    _.includes(['date', 'date-time', 'time'], schema.format)
  );
};

// real component
export const genFieldPropsAndRules = ({
  parentSchema,
  schema
}: {
  parentSchema?: FieldSchema;
  schema: FieldSchema;
}) => {
  // const { additionalProperties, items } = schema;
  const uiExtensions = schema['x-walrus-ui'] || {};
  const {
    type,
    title,
    readOnly,
    required,
    maximum,
    minimum,
    default: defaultValue,
    enum: enumList,
    maxLength,
    minLength,
    items
  } = schema;
  const {
    required: requiredFlag,
    immutable,
    hidden,
    showIf,
    doc,
    message,
    widget
  } = uiExtensions;

  if (type === FIELD_TYPE.BOOLEAN) {
    return {
      fieldProps: {
        label: title,
        disabled: readOnly || immutable,
        trueValue: true,
        falseValue: false,
        hidden: hidden || false,
        showIf: showIf || ''
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.select'
        }
      ],
      default: defaultValue
    };
  }
  if (type === FIELD_TYPE.INTEGER || type === FIELD_TYPE.NUMBER) {
    return {
      fieldProps: {
        label: title,
        min: minimum,
        max: maximum,
        disabled: readOnly || immutable,
        hidden: hidden || false,
        showIf: showIf || ''
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.input'
        }
      ],
      default: defaultValue
    };
  }

  if (type === FIELD_TYPE.STRING && !enumList?.length) {
    return {
      fieldProps: {
        label: title,
        maxLength,
        minLength,
        showWordLimit: !!maxLength,
        disabled: readOnly || immutable,
        hidden: hidden || false,
        showIf: showIf || ''
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.input'
        }
      ],
      default: defaultValue
    };
  }
  // select
  if (type === FIELD_TYPE.STRING && enumList?.length) {
    return {
      fieldProps: {
        label: title,
        disabled: readOnly || immutable,
        hidden: hidden || false,
        showIf: showIf || ''
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.select'
        }
      ],
      default: defaultValue
    };
  }

  if (type === FIELD_TYPE.ARRAY && enumList?.length) {
    return {
      fieldProps: {
        label: title,
        disabled: readOnly || immutable,
        hidden: hidden || false,
        showIf: showIf || '',
        multiple: true
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.select'
        }
      ],
      default: defaultValue
    };
  }
  if (type === FIELD_TYPE.ARRAY && items && !enumList?.length) {
    return {
      fieldProps: {
        label: title,
        disabled: readOnly || immutable,
        hidden: hidden || false,
        showIf: showIf || '',
        allowCreate: true,
        multiple: true
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message: message || 'common.form.rule.input'
        }
      ],
      default: defaultValue
    };
  }
  return {
    fieldProps: {
      label: title,
      disabled: readOnly || immutable,
      hidden: hidden || false,
      showIf: showIf || ''
    },
    rules: [
      {
        required: requiredFlag || required || false,
        message: message || 'common.form.rule.input'
      }
    ],
    default: defaultValue
  };
};

export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
  const { type } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  if (widget) {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath]
    };
  }
  if (type) {
    return {
      component: FIELD_TYPE[type],
      fieldPath: [...fieldPath]
    };
  }
  return {
    component: null,
    fieldPath: []
  };
};
export default {};
