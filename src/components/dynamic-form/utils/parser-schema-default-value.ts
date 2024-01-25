import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../interface';
import { initFieldDefaultValue } from './index';

export const parseSchemaDefaultValue = ({
  schema = {} as FieldSchema,
  formData = {}
}: {
  schema: FieldSchema;
  formData: object;
}) => {
  const properties = (schema.properties || {}) as FieldSchema;
  const keys = _.keys(properties);

  _.each(keys, (key) => {
    const property = properties[key];
    const { type } = property;

    const fieldSchema = {
      ...property,
      name: key,
      type,
      fieldPath: [...(schema.fieldPath || []), key],
      default: property.default
    };

    const defaultValue = initFieldDefaultValue(fieldSchema);
    const currentValue = _.get(formData, fieldSchema.fieldPath);
    _.set(formData, fieldSchema.fieldPath, currentValue || defaultValue);

    if (type === FIELD_TYPE.OBJECT) {
      parseSchemaDefaultValue({
        schema: fieldSchema as FieldSchema,
        formData
      });
    } else if (type === FIELD_TYPE.ARRAY) {
      if (
        fieldSchema?.minItems &&
        !_.get(formData, fieldSchema.fieldPath, []).length
      ) {
        for (let i = 0; i < fieldSchema.minItems; i += 1) {
          parseSchemaDefaultValue({
            schema: {
              ...fieldSchema.items,
              fieldPath: [...fieldSchema.fieldPath, `${i}`]
            },
            formData
          });
        }
      }
    }
  });
};

export default {};
