import { PropType } from 'vue';
import { FieldSchema } from '../interface';

export default {
  schema: {
    type: Object as PropType<FieldSchema>,
    default() {
      return {};
    }
  },
  formData: {
    type: Object,
    default() {
      return {};
    }
  },
  fieldPath: {
    type: Array as PropType<string[]>,
    default() {
      return [];
    }
  },
  description: {
    type: String,
    default: ''
  },
  showIf: {
    type: String,
    default: ''
  },
  hidden: {
    type: Boolean,
    default: false
  },
  doc: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  // parent required fields
  requiredFields: {
    type: Array as PropType<string[]>,
    default() {
      return [];
    }
  },
  parentSpan: {
    type: Number,
    default: 24
  },
  disabled: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: ''
  }
};
