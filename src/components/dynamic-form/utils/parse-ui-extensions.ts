import { FieldRule } from '@arco-design/web-vue';
import _ from 'lodash';
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
  const { min, max, minLength, maxLength, readOnly } = property;
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
    maxLength,
    readOnly
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

export const inhertGroupFromParent = (parentGroup, childGroup) => {
  if (!parentGroup) return childGroup;
  if (!childGroup) return parentGroup;
  const parentGroupList = _.split(parentGroup, '/');
  const childGroupList = _.split(childGroup, '/');
  if (parentGroupList[0] === childGroupList[0]) return childGroup;
  return `${parentGroup}/${childGroup}`;
};
export default {};
