import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../config/interface';
import {
  parseUIExtensions,
  inhertGroupFromParent
} from './parse-ui-extensions';

export const initFormStateBySchema = ({
  schema = {},
  formData = {},
  fieldSchemaList = [],
  fieldPath = [],
  nested = false,
  ignoreExtension = false
}: {
  schema: any;
  formData: object;
  nested?: boolean;
  fieldSchemaList: FieldSchema[];
  fieldPath: string[];
  ignoreExtension?: boolean;
}) => {
  const properties = schema.properties || {};
  const required = schema.required || [];
  const keys = Object.keys(properties);
  _.each(keys, (key) => {
    const property = properties[key];
    const { type } = property;
    const requiredFlag = required.includes(key);

    // if nested, inherit group from parent
    if (nested && schema.type === FIELD_TYPE.OBJECT) {
      property['x-walrus-ui'] = {
        ...property['x-walrus-ui'],
        group: inhertGroupFromParent(
          schema['x-walrus-ui']?.group,
          property['x-walrus-ui']?.group
        ),
        hidden: schema['x-walrus-ui']?.hidden
      };
    }
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
    if (!ignoreExtension) {
      const uiSchema = parseUIExtensions(property, requiredFlag);
      fieldSchema.uiSchema = uiSchema;
    }

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
        fieldPath: fieldSchema.fieldPath,
        nested: true,
        ignoreExtension
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

export const initFormState = (schema: any, ignoreExtension?: boolean) => {
  const formData = {};
  const fieldSchemaList: any[] = [];
  initFormStateBySchema({
    schema,
    formData,
    fieldSchemaList,
    fieldPath: [],
    ignoreExtension
  });
  console.log('fieldSchemaList', fieldSchemaList);
  return {
    formData,
    fieldSchemaList
  };
};

export default {};
