import { FieldRule } from '@arco-design/web-vue';
import { UISchema } from '../config/interface';
import {
  createFieldComponent,
  createFieldComponentByWidget
} from './create-field-component';
import { createFieldRules } from './create-field-rules';

// property is a openapi schema property
export const parseUIExtensions = (
  property: any,
  requiredFlag: boolean
): UISchema => {
  const uiExtensions = property['x-walrus-ui'] || {};
  const { type, not, min, max, minLength, maxLength } = property;
  const { widget, required, message, ...rest } = uiExtensions;

  const fieldComponent = widget
    ? createFieldComponentByWidget(widget)
    : createFieldComponent(property);
  const rules = createFieldRules(
    property,
    requiredFlag,
    fieldComponent.component
  );

  const props = {
    ...uiExtensions.props,
    min,
    max,
    minLength,
    maxLength
  };

  return {
    ...rest,
    ...fieldComponent,
    widget,
    required: requiredFlag || required,
    rules,
    props
  };
};

export default {};
