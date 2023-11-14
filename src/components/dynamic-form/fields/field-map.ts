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
import stringField from './string-field/index.vue';

export default {
  Input: sealInput,
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
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'IntegerField',
  number: 'NumberField',
  object: 'ObjectField',
  string: stringField
};

export const FieldTypes = {
  types: {
    boolean: sealSwitch,
    string: sealInput,
    number: sealInputNumber,
    integer: sealInputNumber
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
    radioGroup: RadioGroup,
    checkboxGroup: CheckboxGroup
  }
};
