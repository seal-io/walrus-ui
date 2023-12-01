import _ from 'lodash';
import { RadioGroup, CheckboxGroup } from '@arco-design/web-vue/es';

import HintInput from '@/components/hint-input/index.vue';
import AceEditor from '@/components/ace-editor/index.vue';
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
import SelectField from '../components/select-field.vue';
import BooleanField from '../components/boolean-field.vue';
import ObjectMap from '../components/object-map.vue';
import ComponentsMap from '../components/components-map';
import FIELD_TYPE from '../config/field-type';
import {
  isBasicType,
  isSimpleObject,
  isSelect,
  isMuliSelect,
  isYamlEditor
} from '../utils';

export const CommonFieldMaps = {
  textArea: sealTextarea,
  select: sealSelect,
  password: HintInput,
  aceEditor: AceEditor,
  xInputGroup,
  radioGroup: RadioGroup,
  checkboxGroup: CheckboxGroup
};

// has formItem component
export const FieldMaps = {
  array: ArrayField,
  object: ObjectField,
  select: SelectField,
  checkbox: BooleanField,
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

export const getSchemaFieldComponent = ({ schema, fieldPath, formData }) => {
  const { type, required: requiredFields } = schema;
  const widget = _.get(schema, ['x-walrus-ui', 'widget'], '');

  const commonAttrs = {
    key: Date.now()
  };
  // build-in component
  if (widget && widget !== 'TextArea') {
    return {
      component: ComponentsMap[widget],
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (isYamlEditor(schema)) {
    return {
      component: ComponentsMap.YamlEditor,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }

  if (isMuliSelect(schema) || isSelect(schema)) {
    return {
      component: FieldMaps.select,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.ARRAY) {
    return {
      component: FieldMaps.array,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.OBJECT && isSimpleObject(schema)) {
    return {
      component: FieldMaps.simpleObject,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.OBJECT) {
    return {
      component: FieldMaps.object,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (type === FIELD_TYPE.BOOLEAN) {
    return {
      component: FieldMaps.checkbox,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  if (isBasicType(schema)) {
    return {
      component: FieldMaps.stringField,
      fieldPath: [...fieldPath],
      requiredFields,
      commonAttrs
    };
  }
  return {
    component: FieldMaps.stringField,
    fieldPath: [...fieldPath],
    requiredFields,
    commonAttrs
  };
};
