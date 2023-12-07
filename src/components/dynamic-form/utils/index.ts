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

export const isInvalidSchema = (schema: FieldSchema) => {
  const { type, properties, additionalProperties } = schema;
  return (
    type === FIELD_TYPE.OBJECT &&
    !_.keys(properties).length &&
    !additionalProperties
  );
};

export const isAnyObject = (schema: FieldSchema) => {
  const { type, properties, additionalProperties } = schema;
  return (
    (type === FIELD_TYPE.OBJECT || !type) &&
    !_.keys(properties).length &&
    !additionalProperties
  );
};
export const isSimpleObject = (schema: FieldSchema) => {
  // value is any
  const isAnyAdditionalProperties =
    _.isBoolean(schema.additionalProperties) && schema.additionalProperties;

  // value is string
  const isMapString =
    _.isObject(schema.additionalProperties) &&
    schema.additionalProperties?.type === 'string';

  // value is boolean
  const isMapBoolean =
    _.isObject(schema.additionalProperties) &&
    schema.additionalProperties?.type === 'boolean';

  // value is number
  const isMapNumber =
    _.isObject(schema.additionalProperties) &&
    _.includes(['number', 'integer'], schema.additionalProperties?.type);

  return (
    isAnyAdditionalProperties || isMapString || isMapNumber || isMapBoolean
  );
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

export const isFixedOptionSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.STRING && enumList?.length;
};

export const isAllowCreateSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  return (
    type === FIELD_TYPE.ARRAY &&
    ((!enumList?.length && enumList) ||
      _.includes(
        [FIELD_TYPE.STRING, FIELD_TYPE.NUMBER, FIELD_TYPE.INTEGER],
        items?.type
      ))
  );
};

export const isAllowCreateNumberSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  return (
    (items?.type === FIELD_TYPE.NUMBER || items?.type === FIELD_TYPE.INTEGER) &&
    !enumList?.length &&
    type === FIELD_TYPE.ARRAY
  );
};

export const isNonObject = (schema: any) => {
  const { type, properties, additionalProperties } = schema;
  return type === FIELD_TYPE.OBJECT && !properties && !additionalProperties;
};
export const isYamlEditor = (schema: FieldSchema) => {
  const { type, properties, additionalProperties, items } = schema;
  if (
    type === FIELD_TYPE.OBJECT &&
    !_.keys(properties).length &&
    (!additionalProperties ||
      additionalProperties?.type === FIELD_TYPE.OBJECT ||
      additionalProperties?.type === FIELD_TYPE.ARRAY)
  ) {
    return true;
  }
  if (
    type === FIELD_TYPE.ARRAY &&
    (isNonObject(items) || !_.get(items, 'type'))
  ) {
    return true;
  }
  return false;
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

export const parentObjectExsits = (formData, fieldPath: string[]) => {
  const initialPath = _.initial(fieldPath);
  if (!initialPath.length) return true;
  const parentValue = _.get(formData, initialPath);
  return parentValue && _.keys(parentValue).length > 0;
};

export const initFieldValue = ({
  defaultFormData,
  fieldPath,
  schema,
  formData,
  uiFormData,
  required
}: {
  fieldPath: string[];
  schema: FieldSchema;
  formData: object;
  uiFormData: object;
  defaultFormData: object;
  required: boolean;
}) => {
  // no default value and not required
  const isRequired = !!schema.enum || required;
  if (isEmptyvalue(schema.default) && !isRequired) {
    return;
  }

  const defaultValue = initFieldDefaultValue(schema);
  const currentValue = _.get(uiFormData, fieldPath);
  const value = currentValue || defaultValue;
  _.set(uiFormData, fieldPath, _.cloneDeep(value));
  if (!_.hasIn(defaultFormData, fieldPath)) {
    _.set(defaultFormData, fieldPath, _.cloneDeep(value));
  }
  if (!schema.nullable && !schema.originNullable) {
    _.set(formData, fieldPath, _.cloneDeep(value));
  }
};

export const viewFieldValue = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  required,
  defaultFormData
}: {
  fieldPath: string[];
  schema: FieldSchema;
  formData: object;
  uiFormData: object;
  defaultFormData: object;
  required: boolean;
}) => {
  const defaultValue = initFieldDefaultValue(schema);
  const currentValue = _.get(formData, fieldPath);
  const originValue = _.get(defaultFormData, fieldPath);

  if (_.hasIn(formData, fieldPath)) {
    _.set(uiFormData, fieldPath, _.cloneDeep(currentValue));
  } else {
    _.set(uiFormData, fieldPath, _.cloneDeep(originValue || defaultValue));
  }
  // Avoid overriding global defaults
  if (!_.hasIn(formData, fieldPath)) {
    _.set(defaultFormData, fieldPath, _.cloneDeep(defaultValue));
  }
};

export const unsetFieldByPath = (formData, initialPath) => {
  if (!initialPath.length) return;
  const len = _.keys(_.get(formData, initialPath)).length;
  const childInitialPath = _.initial(initialPath);
  if (!len && !_.isArray(_.get(formData, initialPath))) {
    _.unset(formData, initialPath);
  } else if (
    !len &&
    _.isArray(_.get(formData, initialPath)) &&
    _.last(initialPath)
  ) {
    _.pullAt(_.get(formData, initialPath), _.toNumber(_.last(initialPath)));
  }
  unsetFieldByPath(formData, childInitialPath);
};

export const genFieldInFormData = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  required
}: {
  fieldPath: string[];
  schema: FieldSchema;
  formData: object;
  uiFormData: object;
  required: boolean;
}) => {
  if (!schema.nullable && !schema.originNullable) {
    return;
  }
  const initialPath = _.initial(fieldPath);
  const originValue = _.get(uiFormData, initialPath);
  _.each(_.keys(originValue), (key) => {
    if (!_.hasIn(formData, [...initialPath, key])) {
      const value = _.get(uiFormData, [...initialPath, key]);
      _.set(formData, [...initialPath, key], _.cloneDeep(value));
    }
  });
};
export const isEqualOn = (current, origin) => {
  return _.isEqualWith(current, origin, (value1, value2) => {
    if (isEmptyvalue(value1) && isEmptyvalue(value2)) {
      return true;
    }
    return _.isEqual(value1, value2);
  });
};
export const unsetFieldValue = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  defaultFormData,
  required
}: {
  fieldPath: string[];
  schema: FieldSchema;
  formData: object;
  uiFormData: object;
  defaultFormData: object;
  required: boolean;
}) => {
  if (!schema.nullable && !schema.originNullable) {
    return;
  }
  const initialPath = _.initial(fieldPath);
  const originValue = _.get(defaultFormData, initialPath);
  const currentValue = _.get(uiFormData, initialPath);
  console.log('unsetFieldValue++++++++++99=', {
    originValue,
    currentValue,
    defaultFormData
  });

  // if each field'value is default value,unset it
  if (initialPath.length === 0) {
    _.unset(formData, fieldPath);
  } else if (isEqualOn(currentValue, originValue)) {
    _.unset(formData, initialPath);
  }
  unsetFieldByPath(formData, initialPath);
  // if (!required) {
  //   _.unset(formData, fieldPath);
  // } else if (
  //   (schema.nullable || schema.originNullable) &&
  //   _.keys(_.get(formData, initialPath).length === 1)
  // ) {
  //   _.unset(formData, fieldPath);
  // }
  // unsetFieldByPath(formData, initialPath);
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

const setNullableValue = (schema: FieldSchema, property, parentNullableObj) => {
  const nullObj = {
    nullable: property.nullable || false,
    originNullable:
      schema.nullable ||
      schema.originNullable ||
      parentNullableObj?.nullable ||
      parentNullableObj?.originNullable ||
      false
  };
  if (property?.enum) {
    nullObj.nullable = false;
    nullObj.originNullable = false;
  }
  return nullObj;
};
export const genObjectFieldProperties = ({
  uiFormData,
  defaultFormData,
  schema,
  fieldPath,
  grandParentHalfGrid,
  parentNullableObj,
  parentSpan,
  level
}: {
  uiFormData: object;
  defaultFormData: object;
  schema: FieldSchema;
  parentNullableObj?: {
    nullable?: boolean;
    originNullable?: boolean;
  };
  level: number;
  parentSpan?: number;
  grandParentHalfGrid?: boolean; // when has items,need pass it
  fieldPath: string[];
}) => {
  if (!_.keys(schema?.properties).length) {
    return [];
  }
  const { properties } = schema;
  const defaultOrder = 9999;

  const resultList: FieldSchema[] = [];
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
    const nullObj = setNullableValue(schema, property, parentNullableObj);

    const fieldSchema = {
      ...property,
      ...nullObj,
      default:
        property.default ||
        _.cloneDeep(_.get(defaultFormData, [...fieldPath, key])),
      name: key,
      fieldPath: [...fieldPath, key],
      required: property.required || [],
      isRequired: _.includes(property.required || [], key),
      parentRequired: schema.required || [],
      colSpan: colSpanData.span,
      halfGrid: colSpanData.halfGrid,
      level,
      order,
      _t: Date.now()
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
    disabled: false,
    readonly: readOnly,
    immutable,
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
          // required: requiredFlag || required || false,
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
          // required: requiredFlag || required || false,
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
          // required: requiredFlag || required || false,
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
          // required: true,
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
          // required: isRequired,
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
          // required: requiredFlag || required || false,
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
        // required: requiredFlag || required || false,
        message:
          message ||
          i18n.global.t('common.form.rule.input', { name: title || name })
      }
    ],
    default: defaultValue
  };
};

export default {};
