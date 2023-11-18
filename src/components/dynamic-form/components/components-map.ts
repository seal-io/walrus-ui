import sealTextarea from '@/components/seal-form/components/seal-textarea.vue';
import AceEditor from '@/components/ace-editor/index.vue';
import businessComponents from '../../form-create/custom-components';

export default {
  ...businessComponents,
  Textarea: sealTextarea,
  AceEditor
};
