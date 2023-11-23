import _ from 'lodash';
import i18n from '@/locale';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../interface';
import { getConditionValue } from '../../form-create/config/utils';
import { parseExpression } from '../../form-create/config/experssion-parser';

export const isBasicType = (type) => {
  return [
    FIELD_TYPE.BOOLEAN,
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.STRING,
    FIELD_TYPE.INTEGER
  ].includes(type);
};

export const isEmptyvalue = (val) => {
  return val === '' || val === null || val === undefined;
};

export const isSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  if (items && type === FIELD_TYPE.ARRAY && isBasicType(items.type)) {
    return true;
  }
  return enumList && enumList.length > 0;
};

export const isBoolean = (schema: FieldSchema) => {
  const { type } = schema;
  return type === FIELD_TYPE.BOOLEAN;
};

export const isSimpleObject = (schema: FieldSchema) => {
  // value is any
  const isAnyAdditionalProperties =
    _.isBoolean(schema.additionalProperties) && schema.additionalProperties;

  // value is string
  const isMapString =
    _.isObject(schema.additionalProperties) &&
    schema.additionalProperties?.type === 'string';

  // value is number
  const isMapNumber =
    _.isObject(schema.additionalProperties) &&
    _.includes(['number', 'integer'], schema.additionalProperties?.type);

  return isAnyAdditionalProperties || isMapString || isMapNumber;
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

export const getShowIfValue = (showif, formData, fieldPath?: string[]) => {
  const conditions = parseExpression(showif);
  const isShow = getConditionValue(
    {
      conditions,
      showIf: showif,
      fieldPath
    },
    formData
  );
  return isShow;
};

// has default value or required field
export const isRequiredInitField = (schema: FieldSchema, required) => {
  return schema.default || required || !isBasicType(schema.type);
};

export const initFieldDefaultValue = (item) => {
  if (item.default || item.default === 0 || item.default === false) {
    return item.default;
  }
  const { type } = item;
  if (type === FIELD_TYPE.ARRAY) {
    return [];
  }
  if (type === FIELD_TYPE.OBJECT) {
    return {};
  }
  if (type === FIELD_TYPE.BOOLEAN) {
    return null;
  }
  if (type === FIELD_TYPE.NUMBER || type === FIELD_TYPE.INTEGER) {
    return null;
  }
  return '';
};

export const checkValidValue = ({ value, schema, required }) => {
  if (
    schema.default ||
    [FIELD_TYPE.ARRAY, FIELD_TYPE.OBJECT].includes(schema.type)
  ) {
    return true;
  }
  if (!required && (value === '' || value === null || value === undefined)) {
    return false;
  }
  return true;
};
export const calcFieldSpan = ({ parentSpan, colSpan, parentHalfGrid }) => {
  parentSpan = parentSpan || 12;
  if (colSpan) {
    return {
      span: colSpan,
      halfGrid: colSpan < 12
    };
  }
  if (parentHalfGrid) {
    return {
      span: colSpan || 6,
      halfGrid: true
    };
  }
  if (parentSpan === 12) {
    const span = colSpan || 6;
    return {
      span,
      halfGrid: span < 12
    };
  }

  return {
    span: 12,
    halfGrid: false
  };
};

export const getCustomColSpan = (obj) => {
  return _.get(obj, ['x-walrus-ui', 'colSpan']);
};

export const isHalfGrid = (obj) => {
  const colSpan =
    _.get(obj, 'colSpan') || _.get(obj, ['x-walrus-ui', 'colSpan']);
  return colSpan < 12;
};
export const genObjectFieldProperties = ({
  schema,
  fieldPath,
  grandParentHalfGrid,
  parentSpan,
  level
}: {
  schema: FieldSchema;
  formData: any;
  level: number;
  parentSpan?: number;
  grandParentHalfGrid?: boolean; // when has items,need pass it
  fieldPath: string[];
}) => {
  if (!_.keys(schema?.properties).length) {
    return [];
  }
  const { properties } = schema;
  // const { required: requiredFlag } = schema;
  const resultList: FieldSchema[] = [];
  const defaultOrder = 9999;
  const keys = _.keys(properties);

  _.each(keys, (key) => {
    const property = _.get(properties, key);
    const { type } = property;
    const order = property['x-walrus-ui']?.order || defaultOrder;
    const colSpanData = calcFieldSpan({
      parentSpan,
      colSpan: property['x-walrus-ui']?.colSpan,
      parentHalfGrid: isHalfGrid(schema)
    });
    // const required = _.includes(requiredFlag, key);
    const fieldSchema = {
      ...property,
      name: key,
      fieldPath: [...fieldPath, key],
      required: property.required || [],
      isRequired: _.includes(property.required || [], key),
      parentRequired: schema.required || [],
      colSpan: colSpanData.span,
      halfGrid: colSpanData.halfGrid,
      level,
      order
    };

    resultList.push(fieldSchema);
  });

  return _.sortBy(resultList, 'order');
};

export const setFieldValue = (formData, fieldPath, schema) => {
  return _.get(formData, fieldPath, initFieldDefaultValue(schema));
};
// set field schema value
export const setHiddenFieldValue = ({
  schema,
  formData,
  fieldPath
}: {
  schema: FieldSchema;
  formData: any;
  fieldPath: string[];
}) => {
  const { properties } = schema;
  const { required: requiredFlag } = schema;
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
    if (type === FIELD_TYPE.OBJECT) {
      const value = setFieldValue(formData, [...fieldPath, key], fieldSchema);
      _.set(formData, [...fieldPath, key], value);
      setHiddenFieldValue({
        schema: fieldSchema,
        formData,
        fieldPath: [...fieldPath, key]
      });
    } else {
      const value = setFieldValue(formData, [...fieldPath, key], fieldSchema);
      _.set(formData, [...fieldPath, key], value);
    }
  });
};

// real component
export const genFieldPropsAndRules = ({
  requiredFields,
  schema
}: {
  requiredFields: string[];
  schema: FieldSchema;
}) => {
  // const { additionalProperties, items } = schema;
  const uiExtensions = schema['x-walrus-ui'] || {};
  const {
    type,
    title,
    name,
    readOnly,
    maximum,
    minimum,
    externalDocs,
    default: defaultValue,
    enum: enumList,
    description,
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

  const maxLength = schema?.maxLength || null;
  const minLength = schema.minLength || null;
  const required = _.includes(requiredFields, name);
  const commonProps = {
    label: title || name,
    disabled: readOnly || immutable,
    hidden: hidden || false,
    showIf: showIf || '',
    doc: externalDocs || '',
    required: requiredFlag || required || false,
    password: isPassword(schema),
    description
  };

  // boolean
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
          message:
            message ||
            i18n.global.t('common.form.rule.select', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }
  // number
  if (type === FIELD_TYPE.INTEGER || type === FIELD_TYPE.NUMBER) {
    return {
      fieldProps: {
        min: minimum || -Infinity,
        max: maximum || Infinity,
        ...commonProps
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message:
            message ||
            i18n.global.t('common.form.rule.input', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }

  // string

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
          message:
            message ||
            i18n.global.t('common.form.rule.input', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }
  // select
  if (type === FIELD_TYPE.STRING && enumList?.length) {
    return {
      fieldProps: {
        ...commonProps,
        maxTagCount: 3,
        required: true
      },
      rules: [
        {
          required: true,
          message:
            message ||
            i18n.global.t('common.form.rule.select', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }

  if (isMuliSelect(schema)) {
    const isRequired = !!enumList?.length || requiredFlag || required || false;
    return {
      fieldProps: {
        ...commonProps,
        maxTagCount: 3,
        multiple: true,
        required: isRequired
      },
      rules: [
        {
          required: isRequired,
          message:
            message ||
            i18n.global.t('common.form.rule.select', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }

  if (type === FIELD_TYPE.ARRAY && (items || !enumList?.length)) {
    return {
      fieldProps: {
        ...commonProps,
        allowCreate: true,
        maxTagCount: 3,
        multiple: true
      },
      rules: [
        {
          required: requiredFlag || required || false,
          message:
            message ||
            i18n.global.t('common.form.rule.input', { name: title || name })
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
        message:
          message ||
          i18n.global.t('common.form.rule.input', { name: title || name })
      }
    ],
    default: defaultValue
  };
};

export default {};
