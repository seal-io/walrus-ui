import _ from 'lodash';
import { FieldSchema } from './interface';
import { Widget } from './widget';

export const setFieldDefaultValue = (schema) => {
  if (schema.type === 'object') return {};
  if (schema.type === 'array') return [];
  if (schema.type === 'string') return '';
  if (schema.type === 'number' || schema.type === 'integer') return null;
  if (schema.type === 'boolean') return false;
  return null;
};

export const FieldDataType = {
  isListNumber(property: FieldSchema) {
    const { type, items } = property;
    if (type === 'array') {
      return _.isArray(items)
        ? _.every(items, (val) => val === 'number' || val === 'integer')
        : items?.type === 'number' || items?.type === 'integer';
    }
    return false;
  },
  isListString(property: FieldSchema) {
    const { type, items } = property;
    if (type === 'array') {
      return _.isArray(items)
        ? _.every(items, (val) => val === 'string')
        : items?.type === 'string';
    }
    return false;
  },
  isMap(property: FieldSchema) {
    const { type, additionalProperties } = property;
    return type === 'object' && additionalProperties;
  },
  isJson(property: FieldSchema) {
    return (
      property.type === 'object' &&
      property.uiSchema.widget === Widget.AceEditor
    );
  }
};

export default {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  NUMBER: 'number',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NULL: 'null'
};
