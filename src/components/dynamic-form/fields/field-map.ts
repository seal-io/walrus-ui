import _ from 'lodash';
import {
  Input,
  InputNumber,
  InputPassword,
  Select,
  Option,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Textarea,
  Switch
} from '@arco-design/web-vue/es';

import HintInput from '@/components/hint-input/index.vue';
import AceEditor from '@/components/ace-editor/index.vue';
import sealInputPassword from '@/components/seal-form/components/seal-input-password.vue';
import sealInput from '@/components/seal-form/components/seal-input.vue';
import sealSelect from '@/components/seal-form/components/seal-select.vue';
import sealInputNumber from '@/components/seal-form/components/seal-input-number.vue';
import sealCheckbox from '@/components/seal-form/components/seal-checkbox.vue';
import sealSwitch from '@/components/seal-form/components/seal-switch.vue';
import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import datePicker from '@/components/seal-form/components/date-picker.vue';
import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
import stringField from './string-field/index.vue';
import ObjectField from '../components/object-field.vue';
import ArrayField from '../components/array-field.vue';

import { FieldSchema } from '../interface';
import ComponentsMap from '../components/components-map';
import FIELD_TYPE from '../config/field-type';

export default {
  Input: HintInput,
  InputNumber: sealInputNumber,
  InputPassword: sealInputPassword,
  Select: sealSelect,
  Option,
  Radio,
  RadioGroup,
  Checkbox: sealCheckbox,
  CheckboxGroup,
  Switch: sealSwitch,
  HintInput,
  Textarea: sealTextarea,
  AceEditor
};

export const FieldMaps = {
  array: ArrayField,
  object: ObjectField,
  boolean: sealCheckbox,
  integer: sealInputNumber,
  number: sealInputNumber,
  string: stringField
};

export const FieldTypes = {
  types: {
    boolean: sealSwitch,
    string: HintInput,
    number: sealInputNumber,
    integer: sealInputNumber,
    array: ArrayField,
    object: ObjectField
  },
  formats: {
    'time': datePicker,
    'date': datePicker,
    'date-time': datePicker
  },
  common: {
    textArea: sealTextarea,
    select: sealSelect,
    password: sealInputPassword,
    aceEditor: AceEditor,
    xInputGroup,
    radioGroup: RadioGroup,
    checkboxGroup: CheckboxGroup
  }
};

export const isMuliSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.ARRAY && enumList && enumList.length > 0;
};

export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
  const { type } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  if (widget) {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath]
    };
  }
  if (
    type === FIELD_TYPE.OBJECT &&
    _.get(schema, 'additionalProperties.type') === FIELD_TYPE.STRING
  ) {
    return {
      component: FieldTypes.common.xInputGroup,
      fieldPath: [...fieldPath]
    };
  }

  if (isMuliSelect(schema)) {
    return {
      component: FieldTypes.common.select,
      fieldPath: [...fieldPath]
    };
  }
  if (type) {
    return {
      component: FieldTypes.types[type],
      fieldPath: [...fieldPath]
    };
  }
  return {
    component: null,
    fieldPath: []
  };
};
