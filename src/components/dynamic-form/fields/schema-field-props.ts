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
  onChange: {
    type: Function as PropType<(value: any) => void>,
    default() {
      return () => {};
    }
  },
  level: {
    type: Number,
    default: 0
  },
  rules: {
    type: Array as PropType<any[]>,
    default() {
      return [];
    }
  }
};
