import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import businessComponents from '../../form-create/bussiness-components';
import YamlEditor from './yaml-editor.vue';
import ArrayBasicCreate from './array-basic-create.vue';

export default {
  ...businessComponents,
  TextArea: sealTextarea,
  YamlEditor,
  ArrayBasicCreate
};
