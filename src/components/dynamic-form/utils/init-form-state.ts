import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../config/interface';
import { parseUIExtensions } from './parse-ui-extensions';

export const initFormStateBySchema = ({
  schema = {},
  formData = {},
  fieldSchemaList = [],
  fieldPath = []
}: {
  schema: any;
  formData: object;
  fieldSchemaList: FieldSchema[];
  fieldPath: string[];
}) => {
  const properties = schema.properties || {};
  const required = schema.required || [];
  const keys = Object.keys(properties);
  _.each(keys, (key) => {
    const property = properties[key];
    const { type } = property;
    const requiredFlag = required.includes(key);
    const fieldSchema = {
      name: key,
      type,
      fieldPath: [...fieldPath, key],
      title: property.title,
      description: property.description,
      enum: property.enum || [],
      default: property.default,
      additionalProperties: property.additionalProperties,
      uiSchema: {}
    };
    const component = parseUIExtensions(property, requiredFlag);
    fieldSchema.uiSchema = component;

    if (type !== FIELD_TYPE.OBJECT || property.additionalProperties) {
      fieldSchemaList.push(fieldSchema);
    }
    if (type === FIELD_TYPE.OBJECT) {
      _.set(
        formData,
        _.join(fieldSchema.fieldPath, '.'),
        property.default || {}
      );
      initFormStateBySchema({
        schema: property,
        formData,
        fieldSchemaList,
        fieldPath: fieldSchema.fieldPath
      });
    } else if (type === FIELD_TYPE.ARRAY) {
      _.set(
        formData,
        _.join(fieldSchema.fieldPath, '.'),
        property.default || []
      );
    } else if (type === FIELD_TYPE.STRING) {
      _.set(
        formData,
        _.join(fieldSchema.fieldPath, '.'),
        property.default || ''
      );
    } else if (type === FIELD_TYPE.BOOLEAN) {
      _.set(
        formData,
        _.join(fieldSchema.fieldPath, '.'),
        property.default || false
      );
    } else {
      _.set(
        formData,
        _.join(fieldSchema.fieldPath, '.'),
        property.default || null
      );
    }
  });
};

export const initFormState = (schema: any) => {
  const formData = {};
  const fieldSchemaList: any[] = [];
  initFormStateBySchema({
    schema,
    formData,
    fieldSchemaList,
    fieldPath: []
  });
  return {
    formData,
    fieldSchemaList
  };
};

export default {};
