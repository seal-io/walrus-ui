import { RadioGroup, CheckboxGroup } from '@arco-design/web-vue/es';
import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import AceEditor from '@/components/ace-editor/index.vue';
import HintInput from '@/components/hint-input/index.vue';
import sealSelect from '@/components/seal-form/components/seal-select.vue';
import sealInputNumber from '@/components/seal-form/components/seal-input-number.vue';
import sealCheckbox from '@/components/seal-form/components/seal-checkbox.vue';
import sealSwitch from '@/components/seal-form/components/seal-switch.vue';
import datePicker from '@/components/seal-form/components/date-picker.vue';
import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
import stringField from '../fields/string-field/index.vue';
import ObjectField from './object-field.vue';
import ArrayField from './array-field.vue';
import SelectField from './select-field.vue';
import BooleanField from './boolean-field.vue';
import ObjectMap from './object-map.vue';

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

export default {};
