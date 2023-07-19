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
import hintInput from '@/components/hint-input/index.vue';
import AceEditor from '@/components/ace-editor/index.vue';
import sealInputPassword from '@/components/seal-form/components/seal-input-password.vue';
import sealInput from '@/components/seal-form/components/seal-input.vue';
import sealSelect from '@/components/seal-form/components/seal-select.vue';
import sealInputNumber from '@/components/seal-form/components/seal-input-number.vue';
import sealCheckbox from '@/components/seal-form/components/seal-checkbox.vue';
import sealSwitch from '@/components/seal-form/components/seal-switch.vue';
import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';

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
  hintInput,
  Textarea: sealTextarea,
  AceEditor
};
