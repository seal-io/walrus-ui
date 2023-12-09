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
  uiFormData: {
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
    default: 12
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
  },
  action: {
    type: String as PropType<'edit' | 'view' | 'create'>,
    default() {
      return 'create';
    }
  },
  readonly: {
    type: Boolean,
    default: false
  },
  defaultFormData: {
    type: Object,
    default() {
      return {};
    }
  },
  FieldPathMap: {
    type: Object as PropType<any>,
    default() {
      return new Map();
    }
  }
};
