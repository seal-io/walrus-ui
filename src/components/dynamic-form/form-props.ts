// form props
import { PropType } from 'vue';
import { FieldSchema } from './interface';

export default {
  layout: {
    type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
    default() {
      return 'horizontal';
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  schema: {
    type: Object as PropType<FieldSchema>,
    default() {
      return {};
    }
  }
};
