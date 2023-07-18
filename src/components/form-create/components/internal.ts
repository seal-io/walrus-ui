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

export default {
  Input: sealInput,
  InputNumber: sealInputNumber,
  InputPassword: sealInputPassword,
  Select: sealSelect,
  Option,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Switch,
  hintInput,
  Textarea,
  AceEditor
};
