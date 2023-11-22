import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import AceEditor from '@/components/ace-editor/index.vue';
import businessComponents from '../../form-create/custom-components';
import YamlEditor from './yaml-editor.vue';

export default {
  ...businessComponents,
  TextArea: sealTextarea,
  AceEditor,
  YamlEditor
};
