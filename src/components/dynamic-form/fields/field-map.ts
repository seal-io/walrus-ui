import _ from 'lodash';
import { RadioGroup, CheckboxGroup } from '@arco-design/web-vue/es';

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
import ObjectMap from '../components/object-map.vue';

import { FieldSchema } from '../interface';
import ComponentsMap from '../components/components-map';
import FIELD_TYPE from '../config/field-type';

export const CommonFieldMaps = {
  textArea: sealTextarea,
  select: sealSelect,
  password: HintInput,
  aceEditor: AceEditor,
  xInputGroup,
  radioGroup: RadioGroup,
  checkboxGroup: CheckboxGroup
};

export const FieldMaps = {
  array: ArrayField,
  object: ObjectField,
  simpleObject: ObjectMap,
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
    (enumList?.length ||
      _.includes(
        [FIELD_TYPE.STRING, FIELD_TYPE.NUMBER, FIELD_TYPE.INTEGER],
        items?.type
      ))
  );
};

export const isFixedOptionSelect = (schema: FieldSchema) => {
  const { type, enum: enumList } = schema;
  return type === FIELD_TYPE.STRING && enumList?.length;
};

export const isAllowCreateSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  return (
    type === FIELD_TYPE.ARRAY &&
    ((!enumList?.length && enumList) ||
      _.includes(
        [FIELD_TYPE.STRING, FIELD_TYPE.NUMBER, FIELD_TYPE.INTEGER],
        items?.type
      ))
  );
};

export const isAllowCreateNumberSelect = (schema: FieldSchema) => {
  const { type, enum: enumList, items } = schema;
  return (
    (items?.type === FIELD_TYPE.NUMBER || items?.type === FIELD_TYPE.INTEGER) &&
    !enumList?.length &&
    type === FIELD_TYPE.ARRAY
  );
};

export const isSimpleObject = (schema: FieldSchema) => {
  // value is any
  const isAnyAdditionalProperties =
    _.isBoolean(schema.additionalProperties) && schema.additionalProperties;

  // value is string
  const isMapString =
    _.isObject(schema.additionalProperties) &&
    schema.additionalProperties?.type === 'string';

  // value is number
  const isMapNumber =
    _.isObject(schema.additionalProperties) &&
    _.includes(['number', 'integer'], schema.additionalProperties?.type);

  return isAnyAdditionalProperties || isMapString || isMapNumber;
};

export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
  const { type, required: requiredFields } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  // build-in component
  if (widget && widget !== 'TextArea') {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath],
      requiredFields
    };
  }

  if (type === FIELD_TYPE.ARRAY && !isMuliSelect(schema)) {
    return {
      component: FieldMaps.array,
      fieldPath: [...fieldPath],
      requiredFields
    };
  }
  if (type === FIELD_TYPE.OBJECT && isSimpleObject(schema)) {
    return {
      component: FieldMaps.simpleObject,
      fieldPath: [...fieldPath],
      requiredFields
    };
  }
  if (type === FIELD_TYPE.OBJECT) {
    return {
      component: FieldMaps.object,
      fieldPath: [...fieldPath],
      requiredFields
    };
  }
  return {
    component: FieldMaps.stringField,
    fieldPath: [...fieldPath],
    requiredFields
  };
};
