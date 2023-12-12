import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import widgets from '../widgets/components';
import YamlEditor from './yaml-editor.vue';
import ArrayBasicCreate from './array-basic-create.vue';

export default {
  ...widgets,
  TextArea: sealTextarea,
  YamlEditor,
  ArrayBasicCreate
};
