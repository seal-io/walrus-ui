import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
// import { FieldTypes } from '../fields/field-map';
import { FieldSchema } from '../interface';
// import ComponentsMap from '../components/components-map';

export const isSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  if (items && type === FIELD_TYPE.ARRAY) {
    return true;
  }
  return type === FIELD_TYPE.STRING && enumList && enumList.length > 0;
};

export const isMuliSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.ARRAY && enumList && enumList.length > 0;
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

export const genObjectFieldProperties = ({
  schema,
  parentSchema,
  formData,
  fieldPath
}: {
  schema: FieldSchema;
  parentSchema?: FieldSchema;
  formData: any;
  fieldPath: string[];
}) => {
  if (!_.keys(schema?.properties).length) {
    return [];
  }
  const { properties } = schema;
  const { required: requiredFlag } = schema;
  const resultList: FieldSchema[] = [];
  // const { required: parentRequiredFlag } = parentSchema || {};
  const keys = _.keys(properties);
  _.each(keys, (key) => {
    const property = _.get(properties, key);
    const { type } = property;
    const required = _.includes(requiredFlag, key);
    const fieldSchema = {
      ...property,
      name: key,
      fieldPath: [...fieldPath, key],
      required: property.required || required
    };
    resultList.push(fieldSchema);
  });
  return resultList;
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
    externalDocs,
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
    message,
    widget
  } = uiExtensions;

  const commonProps = {
    label: title,
    disabled: readOnly || immutable,
    hidden: hidden || false,
    showIf: showIf || '',
    doc: externalDocs || '',
    password: isPassword(schema)
  };

  if (type === FIELD_TYPE.BOOLEAN) {
    return {
      fieldProps: {
        trueValue: true,
        falseValue: false,
        ...commonProps
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
        min: minimum,
        max: maximum,
        ...commonProps
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
        maxLength,
        minLength,
        showWordLimit: !!maxLength,
        ...commonProps
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
        ...commonProps
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

  if (isMuliSelect(schema)) {
    return {
      fieldProps: {
        ...commonProps,
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
        ...commonProps,
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
      ...commonProps
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

// export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
//   const { type } = schema;
//   const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

//   if (widget) {
//     return {
//       component: ComponentsMap[widget],
//       fieldPath: [...fieldPath]
//     };
//   }
//   if (
//     type === FIELD_TYPE.OBJECT &&
//     _.get(schema, 'additionalProperties.type') === FIELD_TYPE.STRING
//   ) {
//     return {
//       component: FieldTypes.common.xInputGroup,
//       fieldPath: [...fieldPath]
//     };
//   }

//   if (isMuliSelect(schema)) {
//     return {
//       component: FieldTypes.common.select,
//       fieldPath: [...fieldPath]
//     };
//   }
//   if (type) {
//     return {
//       component: FieldTypes[type],
//       fieldPath: [...fieldPath]
//     };
//   }
//   return {
//     component: null,
//     fieldPath: []
//   };
// };
export default {};
