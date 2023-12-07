import Ajv from 'ajv';
import _ from 'lodash';
import { customFields } from '../components/dynamic-form/interface';

const ajv = new Ajv();

// add custom keywords
_.each(_.keys(customFields), (key) => {
  ajv.addKeyword(key, {
    validate: (schema, data) => {
      return true;
    },
    errors: true,
    modifying: true,
    schema: false,
    valid: true,
    compile: (schema, parentSchema) => {
      return (data, dataPath, parentData, parentDataProperty) => {
        return true;
      };
    },
    metaSchema: {
      type: customFields[key].type
    }
  });
});

const ajvValidate = ({ schema, formData }) => {
  const validate = ajv.compile(schema);
  const valid = validate(formData);
  if (!valid) {
    return validate.errors;
  }
  return [];
};
export default ajvValidate;
