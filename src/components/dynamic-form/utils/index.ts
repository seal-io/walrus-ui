import _ from 'lodash';
import FIELD_TYPE from '../config/field-type';
import { FieldSchema } from '../interface';
import ComponentsMap from '../components/components-map';

export const getSchemaFieldComponent = (schema: FieldSchema, formData) => {
  const { type } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  if (widget) {
    return {
      component: ComponentsMap[widget]
    };
  }
  if (type) {
    return {
      component: FIELD_TYPE[type]
    };
  }
  return {
    component: null
  };
};
export default {};
