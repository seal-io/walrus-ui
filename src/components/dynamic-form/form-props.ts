// form props
import { PropType } from 'vue';

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
  }
};
