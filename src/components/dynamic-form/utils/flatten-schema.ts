import _, { result } from 'lodash';
import { FieldSchema } from '../interface/index';

export const flattenSchema = (
  schema: FieldSchema,
  resultList: FieldSchema[]
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
    if (type === 'object') {
      flattenSchema(fieldSchema, resultList);
    } else if (additionalProperties) {
      flattenSchema(fieldSchema, resultList);
    } else {
      resultList.push(fieldSchema);
    }
    // if (type === 'array') {
    //   const items = _.get(property, 'items', {});
    //   const itemSchema = {
    //     ...items,
    //     name: key,
    //     fieldPath: [...fieldPath, key],
    //     isRequired: customRequired || required
    //   };
    //   flattenSchema(itemSchema, resultList);
    // }
  });
};

export const genFieldMap = (schema: FieldSchema) => {
  const resultList: FieldSchema[] = [];
  flattenSchema(schema, resultList);
  // return _.reduce(
  //   resultList,
  //   (result, item) => {
  //     const fieldPath = _.join(item.fieldPath, '.');
  //     result[fieldPath] = item;
  //     return result;
  //   },
  //   {}
  // );
  return resultList;
};
export default {};
