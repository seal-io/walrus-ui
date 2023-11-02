import FIELD_TYPE from '../config/field-type';
import { Widget } from '../config/widget';

export const createFieldComponent = (fieldSchema): Record<string, string[]> => {
  const { type, additionalProperties } = fieldSchema;
  if (type === FIELD_TYPE.OBJECT && !additionalProperties) {
    return {
      component: []
    };
  }
  if (type === FIELD_TYPE.OBJECT && additionalProperties) {
    return {
      component: [Widget.XInputGroup]
    };
  }
  if (type === FIELD_TYPE.STRING) {
    return {
      component: [Widget.HintInput]
    };
  }
  if (type === FIELD_TYPE.NUMBER) {
    return {
      component: ['InputNumber']
    };
  }
  if (type === FIELD_TYPE.INTEGER) {
    return {
      component: ['InputNumber']
    };
  }
  if (type === FIELD_TYPE.BOOLEAN) {
    return {
      component: ['Checkbox']
    };
  }
  if (type === FIELD_TYPE.ARRAY) {
    return {
      component: ['Select', 'Option']
    };
  }
  return {
    component: ['Textarea']
  };
};

export const createFieldComponentByWidget = (
  widget
): Record<string, string[]> => {
  if (widget === Widget.Select) {
    return {
      component: ['Select', 'Option']
    };
  }
  if (widget === Widget.RadioGroup) {
    return {
      component: ['RadioGroup', 'Radio']
    };
  }
  if (widget === Widget.CheckboxGroup) {
    return {
      component: ['CheckboxGroup', 'Checkbox']
    };
  }
  return {
    component: [widget]
  };
};
export default {};
