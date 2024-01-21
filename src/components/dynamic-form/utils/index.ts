import _ from 'lodash';
import { toRaw } from 'vue';
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

export const isWidget = (schema) => {
  return _.get(schema, ['x-walrus-ui', 'widget']);
};
export const isEmptyvalue = (val) => {
  return val === '' || val === null || val === undefined;
};

export const isEmptyValueField = (schema, val) => {
  if (schema.type === FIELD_TYPE.ARRAY) {
    return !val?.length;
  }
  if (schema.type === FIELD_TYPE.OBJECT) {
    return !_.keys(val).length;
  }
  return val === '' || val === null || val === undefined;
};

export const isSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  if (items && type === FIELD_TYPE.ARRAY && isBasicType(items.type)) {
    return true;
  }
  return enumList && enumList?.length > 0;
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
  return type === FIELD_TYPE.ARRAY && enumList && enumList?.length > 0;
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
  return null;
};

export const parentObjectExsitsInFormData = ({
  formData,
  fieldPath,
  schema
}: {
  formData: object;
  fieldPath: string[];
  schema: FieldSchema;
}) => {
  const initialPath = _.initial(fieldPath);
  if (!initialPath.length) return true;
  const parentValue = _.get(formData, initialPath);
  return parentValue && _.keys(parentValue).length > 0;
};

export const parentObjectExsits = (formData, fieldPath: string[]) => {
  return _.has(formData, fieldPath);
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

  const defaultValue = initFieldDefaultValue(schema);
  const currentValue = _.get(uiFormData, fieldPath);
  const value = currentValue || defaultValue;

  _.set(uiFormData, fieldPath, _.cloneDeep(value));
  if (!_.has(defaultFormData, fieldPath)) {
    _.set(defaultFormData, fieldPath, _.cloneDeep(value));
  }
  const isRequiredItemProperty = schema.arrayItemProperty;
  const checkByValue = required || !isEmptyValueField(schema, value);
  const checkByParentObject = parentObjectExsitsInFormData({
    formData,
    fieldPath,
    schema
  });

  if (checkByValue && (checkByParentObject || isRequiredItemProperty)) {
    _.set(formData, fieldPath, _.cloneDeep(value));
  }
};

export const initFieldValueByNullable = ({
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

  const defaultValue = initFieldDefaultValue(schema);
  const currentValue = _.get(uiFormData, fieldPath);
  const value = currentValue || defaultValue;
  const isNullable = schema.nullable || schema.originNullable;

  _.set(uiFormData, fieldPath, _.cloneDeep(value));
  if (!_.has(defaultFormData, fieldPath)) {
    _.set(defaultFormData, fieldPath, _.cloneDeep(value));
  }

  /**
  *  !isNullable ||
  (schema.isItemsProperty && schema.required && !schema.nullable)
  */
  const isRequiredItemProperty = schema.isItemsProperty && !schema.nullable;
  if (required && (!isNullable || isRequiredItemProperty)) {
    _.set(formData, fieldPath, _.cloneDeep(value));
  }
};

export const viewFieldValue = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  required,
  hidden,
  defaultFormData
}: {
  fieldPath: string[];
  schema: FieldSchema;
  formData: object;
  uiFormData: object;
  hidden: boolean;
  defaultFormData: object;
  required: boolean;
}) => {
  const defaultValue = initFieldDefaultValue(schema);
  const originValue = _.get(defaultFormData, fieldPath);
  const checkByParentObject = parentObjectExsitsInFormData({
    formData: uiFormData,
    fieldPath,
    schema
  });
  const checkByValue =
    required || !isEmptyValueField(schema, originValue || defaultValue);

  if (_.has(uiFormData, fieldPath)) {
    _.set(formData, fieldPath, _.cloneDeep(_.get(uiFormData, fieldPath)));
  } else if (required && checkByParentObject) {
    _.set(formData, fieldPath, _.cloneDeep(originValue || defaultValue));
    _.set(uiFormData, fieldPath, _.cloneDeep(originValue || defaultValue));
  }

  if (!_.has(defaultFormData, fieldPath)) {
    if (!hidden || !isEmptyValueField(schema, originValue || defaultValue)) {
      _.set(
        defaultFormData,
        fieldPath,
        _.cloneDeep(originValue || defaultValue)
      );
    }
  }
};

const unsetArrayField = (formData, initialPath) => {
  const list = _.get(formData, initialPath);
  const validList = _.filter(list, (item) => {
    return (
      !isEmptyvalue(item) &&
      !_.isEmpty(item) &&
      !_.isNull(item) &&
      !_.isUndefined(item)
    );
  });
  if (validList.length === 0) {
    _.unset(formData, initialPath);
  } else {
    _.set(formData, initialPath, _.cloneDeep(validList));
  }
};

const unsetObjectField = (formData, initialPath) => {
  const list = _.keys(_.get(formData, initialPath));
  if (!list.length) {
    _.unset(formData, initialPath);
  }
};

export const unsetInitialField = (formData, initialPath) => {
  if (!initialPath?.length) {
    return;
  }
  if (_.isArray(_.get(formData, initialPath))) {
    unsetArrayField(formData, initialPath);
  } else if (_.isObject(_.get(formData, initialPath))) {
    unsetObjectField(formData, initialPath);
  }
  unsetInitialField(formData, _.initial(initialPath));
};

export const genFieldInFormDataByRecursion = ({
  initialPath,
  formData,
  defaultFormData,
  FieldPathMap,
  required
}: {
  FieldPathMap: Map<string, any>;
  initialPath: string[];
  formData: object;
  defaultFormData: object;
  required: boolean;
}) => {
  const prevInitialPath = _.initial(initialPath);
  const prevSchema = FieldPathMap.get(prevInitialPath.join('.'));

  if (prevSchema && !prevSchema.isNullable) {
    return;
  }

  const originValue = _.get(defaultFormData, prevInitialPath);

  const isArrayPrevInitialPath = _.isArray(_.get(formData, prevInitialPath));
  if (_.keys(originValue).length === 1) {
    return;
  }
  _.each(_.keys(originValue), (key) => {
    const path = _.join([...prevInitialPath, key], '.');
    const pathSchema = FieldPathMap.get(path);

    if (
      !pathSchema?.nullable &&
      path !== _.join(initialPath, '.') &&
      pathSchema?.required
    ) {
      if (
        !_.has(formData, path) ||
        (isArrayPrevInitialPath && _.isUndefined(_.get(formData, path)))
      ) {
        const value = _.get(defaultFormData, path);
        _.set(formData, path, _.cloneDeep(value));
      }
    }
  });

  genFieldInFormDataByRecursion({
    initialPath: prevInitialPath,
    formData,
    defaultFormData,
    FieldPathMap,
    required: prevSchema?.required
  });
};

export const genFieldInFormData = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  defaultFormData,
  FieldPathMap,
  required
}: {
  FieldPathMap: Map<string, any>;
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

  genFieldInFormDataByRecursion({
    initialPath: fieldPath,
    formData,
    defaultFormData,
    FieldPathMap,
    required
  });
};
export const isEqualOn = (current, origin) => {
  return _.isEqualWith(current, origin, (value1, value2, ...args) => {
    if (isEmptyvalue(value1) && isEmptyvalue(value2)) {
      return true;
    }
    return _.isEqual(value1, value2);
  });
};

export const unsetNullabelFieldByRecursion = ({
  initialPath,
  unsetFieldPath,
  formData,
  uiFormData,
  defaultFormData,
  FieldPathMap,
  required
}: {
  FieldPathMap: Map<string, any>;
  initialPath: string[];
  unsetFieldPath?: string[];
  formData: object;
  uiFormData: object;
  defaultFormData: object;
  required: boolean;
}) => {
  const prevInitialPath = _.initial(initialPath);
  if (!prevInitialPath?.length) {
    return unsetFieldPath;
  }
  const prevSchema = FieldPathMap.get(prevInitialPath.join('.'));

  // it is array item
  if (!prevSchema) {
    return unsetNullabelFieldByRecursion({
      initialPath: prevInitialPath,
      unsetFieldPath,
      formData,
      uiFormData,
      defaultFormData,
      FieldPathMap,
      required
    });
  }

  //
  if (!prevSchema?.isNullable && prevSchema) {
    return unsetFieldPath;
  }

  const originValue = _.get(defaultFormData, prevInitialPath);
  const currentValue = _.get(uiFormData, prevInitialPath);

  if (!isEqualOn(originValue, currentValue)) {
    return unsetFieldPath;
  }

  if (prevSchema?.nullable) {
    unsetFieldPath = [...prevInitialPath];
  }

  // when it is array  stop unset
  if (prevSchema?.type === FIELD_TYPE.ARRAY) {
    return unsetFieldPath;
  }
  //
  return unsetNullabelFieldByRecursion({
    initialPath: prevInitialPath,
    unsetFieldPath,
    formData,
    uiFormData,
    defaultFormData,
    FieldPathMap,
    required
  });
};

export const unsetFieldValue = ({
  fieldPath,
  schema,
  formData,
  uiFormData,
  defaultFormData,
  FieldPathMap,
  required
}: {
  FieldPathMap: Map<string, any>;
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
  const initialSchema = FieldPathMap.get(initialPath.join('.'));
  let unsetFieldPath: string[] = [];

  // if each field'value is default value,unset it

  if (initialPath?.length === 0) {
    _.unset(formData, fieldPath);
  } else if (isEqualOn(currentValue, originValue)) {
    if (initialSchema?.nullable) {
      unsetFieldPath = [...initialPath];
    }
    unsetNullabelFieldByRecursion({
      initialPath,
      unsetFieldPath,
      formData,
      uiFormData,
      defaultFormData,
      FieldPathMap,
      required
    });
    _.unset(formData, unsetFieldPath);
  }

  unsetInitialField(formData, unsetFieldPath);
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
      span: colSpan || 12,
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

  // do not care nullable property
  return {
    nullable: false,
    originNullable: false
  };
};
export const genObjectFieldProperties = ({
  uiFormData,
  defaultFormData,
  schema,
  fieldPath,
  grandParentHalfGrid,
  parentNullableObj,
  parentSpan,
  isItems,
  arrayItemProperty,
  level
}: {
  isItems?: boolean;
  arrayItemProperty?: boolean;
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
    let defaultValue = property.default;

    if (
      property.default ||
      property.default === 0 ||
      property.default === false
    ) {
      defaultValue = property.default;
    } else {
      defaultValue = _.cloneDeep(_.get(defaultFormData, [...fieldPath, key]));
    }

    const fieldSchema = {
      ...property,
      ...nullObj,
      default: _.cloneDeep(defaultValue),
      name: key,
      isItemsProperty: isItems || false,
      arrayItemProperty: arrayItemProperty || false,
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
  schemaCustomMeta,
  schema
}: {
  requiredFields: string[];
  schema: FieldSchema;
  schemaCustomMeta: any;
}) => {
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
    immutable: schemaCustomMeta?.immutable ?? immutable,
    hidden: hidden || false,
    showIf: showIf || '',
    doc: externalDocs,
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
        maxTagCount: 3
      },
      rules: [
        {
          message:
            message ||
            i18n.global.t('common.form.rule.select', { name: title || name })
        }
      ],
      default: defaultValue
    };
  }

  if (isMuliSelect(schema)) {
    return {
      fieldProps: {
        ...commonProps,
        maxTagCount: 3,
        multiple: true
      },
      rules: [
        {
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
        message:
          message ||
          i18n.global.t('common.form.rule.input', { name: title || name })
      }
    ],
    default: defaultValue
  };
};

export default {};
