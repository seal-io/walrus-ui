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
  }
};
