import _, { result } from 'lodash';
import { FieldSchema } from '../interface/index';
import { initFieldDefaultValue } from './index';

export const flattenSchema = (
  schema: FieldSchema,
  resultList: FieldSchema[],
  formData?: any
) => {
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
    _.set(formData, fieldSchema.fieldPath, initFieldDefaultValue(fieldSchema));
    if (type === 'object') {
      flattenSchema(fieldSchema, resultList, formData);
    } else if (additionalProperties) {
      flattenSchema(fieldSchema, resultList, formData);
    } else {
      resultList.push(fieldSchema);
    }
    if (type === 'array') {
      const items = _.get(property, 'items', {});
      const itemSchema = {
        ...items,
        name: key,
        fieldPath: [...fieldPath, key],
        isRequired: customRequired || required
      };
      flattenSchema(itemSchema, resultList, formData);
    }
  });
};

export const genFieldMap = (schema: FieldSchema) => {
  const resultList: FieldSchema[] = [];
  const formData: any = {};
  flattenSchema(schema, resultList, formData);
  // return _.reduce(
  //   resultList,
  //   (result, item) => {
  //     const fieldPath = _.join(item.fieldPath, '.');
  //     result[fieldPath] = item;
  //     return result;
  //   },
  //   {}
  // );
  return {
    resultList,
    formData
  };
};
export default {};
