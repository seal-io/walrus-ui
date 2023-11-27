import _ from 'lodash';
import { FieldSchema } from '../interface';
import { isEmptyvalue, isBasicType } from '../utils';

const removeEmptyProperties = (obj) => {
  _.each(_.keys(obj), (key) => {
    if (_.isObject(obj[key])) {
      removeEmptyProperties(obj[key]);
      if (_.keys(obj[key]).length === 0) {
        _.unset(obj, key);
      }
    } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      _.unset(obj, key);
    }
  });
};

const handleObject = (schema: FieldSchema, formData: any) => {
  const properties = schema.properties || {};
  const fieldPath = schema.fieldPath || [];
  const keys = _.keys(properties);
  _.each(keys, (key) => {
    const property = _.get(properties, key);
    const { type } = property;
    const additionalProperties = _.get(
      property,
      'additionalProperties.properties',
      null
    );
    const fieldSchema = {
      ...property,
      name: key,
      fieldPath: [...fieldPath, key]
    };
    if (type === 'object') {
      handleObject(fieldSchema, formData);
    } else if (additionalProperties) {
      handleObject(fieldSchema, formData);
    } else {
      const value = _.get(formData, fieldSchema.fieldPath);
      if (isEmptyvalue(value)) {
        _.unset(formData, fieldSchema.fieldPath);
      }
    }
    if (type === 'array') {
      const items = _.get(property, 'items', {});
      const itemSchema = {
        ...items,
        name: key,
        fieldPath: [...fieldPath, key]
      };
      handleObject(itemSchema, formData);
    }
  });
};
/**
 * object: properties, additionalProperties, array: items,
 * @param schema
 * @param data
 * @param fieldPath
 */
export const flattenSchema = (schema: FieldSchema, formData?: any) => {
  const properties = schema.properties || {};
  const requiredFlag = schema.required || [];
  const fieldPath = schema.fieldPath || [];
  const keys = _.keys(properties);
  _.each(keys, (key) => {
    const property = _.get(properties, key);
    const { type } = property;
    const required = _.includes(requiredFlag, key);
    const customRequired = _.get(property, 'x-walrus-ui.required', false);
    const additionalProperties = _.get(
      property,
      'additionalProperties.properties',
      null
    );
    const fieldSchema = {
      ...property,
      name: key,
      fieldPath: [...fieldPath, key],
      isRequired: customRequired || required
    };

    if (type === 'object') {
      flattenSchema(fieldSchema, formData);
    } else if (additionalProperties) {
      flattenSchema(fieldSchema, formData);
    } else if (
      isEmptyvalue(_.get(formData, fieldSchema.fieldPath)) &&
      !isBasicType(type) &&
      !fieldSchema.default
    ) {
      _.unset(formData, fieldSchema.fieldPath);
    }
    if (type === 'array') {
      const items = _.get(property, 'items', {});
      const itemSchema = {
        ...items,
        name: key,
        fieldPath: [...fieldPath, key],
        isRequired: customRequired || required
      };
      flattenSchema(itemSchema, formData);
    }
  });
};

export default {};
