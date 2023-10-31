import { FieldRule } from '@arco-design/web-vue';
import i18n from '@/locale';
import _ from 'lodash';
import { validateYaml } from '@/components/form-create/config/yaml-parse';
import { Widget } from '../config/widget';

// property is a openapi schema property
export const createFieldRules = (
  property: any,
  requiredFlag,
  component: string[]
): FieldRule[] => {
  const uiExtensions = property['x-walrus-ui'] || {};
  const { not, name, min, max, minLength, maxLength } = property;
  const { required, message } = uiExtensions;
  const rules: FieldRule[] = [];
  const isRequired = requiredFlag || required || false;
  let msg = 'common.form.rule.input';
  const ruleConfig = {
    min,
    max,
    minLength,
    maxLength
  };
  if (
    [
      Widget.Select,
      Widget.Checkbox,
      Widget.RadioGroup,
      Widget.CheckboxGroup,
      Widget.Radio
    ].includes(component[0])
  ) {
    msg = 'common.form.rule.select';
  }

  if (not) {
    rules.push({
      required: isRequired,
      match: not?.pattern
    });
  }
  if (Widget.AceEditor === component[0]) {
    rules.push({
      required: isRequired,
      validator(val, callback) {
        const result = validateYaml(val);
        if (result.error) {
          callback(`${result.error?.message}`);
        } else if (!required) {
          callback();
        } else if (result?.empty) {
          callback(`${name}${i18n.global.t('common.form.rule.input')}`);
        } else {
          callback();
        }
      },
      message: ''
    });
  } else {
    rules.push({
      required: isRequired,
      ..._.pickBy(ruleConfig, (v) => !!v),
      message: message || msg
    });
  }

  return rules;
};

export default {};
