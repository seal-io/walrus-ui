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

export const CommonFieldMaps = {
  textArea: sealTextarea,
  select: sealSelect,
  password: sealInputPassword,
  aceEditor: AceEditor,
  xInputGroup,
  radioGroup: RadioGroup,
  checkboxGroup: CheckboxGroup
};

export const FieldMaps = {
  array: ArrayField,
  object: ObjectField,
  stringField
};

export const BasicFieldMaps = {
  boolean: sealCheckbox,
  string: HintInput,
  number: sealInputNumber,
  integer: sealInputNumber
};

export const FormatsFieldMaps = {
  'time': datePicker,
  'date': datePicker,
  'date-time': datePicker
};

export const isSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  if (items && type === FIELD_TYPE.ARRAY) {
    return true;
  }
  return type === FIELD_TYPE.STRING && enumList && enumList.length > 0;
};

export const isMuliSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  return (
    type === FIELD_TYPE.ARRAY &&
    (enumList?.length || items?.type === FIELD_TYPE.STRING)
  );
};

export const isFixedOptionSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.STRING && enumList?.length;
};

export const isAllowCreateSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.STRING && !enumList?.length;
};

export const isAllowCreateNumberSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return (
    (type === FIELD_TYPE.NUMBER || type === FIELD_TYPE.INTEGER) &&
    !enumList?.length
  );
};

export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
  const { type } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  // build-in component
  if (widget) {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath]
    };
  }

  if (type === FIELD_TYPE.ARRAY && !isMuliSelect(schema)) {
    return {
      component: FieldMaps.array,
      fieldPath: [...fieldPath]
    };
  }
  if (type === FIELD_TYPE.OBJECT) {
    return {
      component: FieldMaps.object,
      fieldPath: [...fieldPath]
    };
  }
  return {
    component: FieldMaps.stringField,
    fieldPath: [...fieldPath]
  };
};
