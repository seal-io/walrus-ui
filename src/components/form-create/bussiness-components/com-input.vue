<script lang="tsx">
  import {
    defineComponent,
    ref,
    computed,
    toRefs,
    watch,
    inject,
    onMounted
  } from 'vue';
  import { BU, WidgetAppendUnit } from './types';

  export default defineComponent({
    name: 'ComInput',
    widgets: [BU.CpuCore, BU.Memory, BU.Disk],
    props: {
      modelValue: {
        type: [String],
        default() {
          return '';
        }
      },
      widget: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue', 'change', 'input'],
    setup(props, { emit, attrs }) {
      const { modelValue, widget } = toRefs(props);
      const currentValue = ref('');

      const fomatter = (val) => {
        const reg = new RegExp(`(${WidgetAppendUnit[widget.value]})$`);
        return val.replace(reg, '');
      };
      const setFormatterValue = (val) => {
        if (!val) return '';
        return `${val}${WidgetAppendUnit[widget.value]}`;
      };
      watch(
        () => modelValue.value,
        (val) => {
          if (val) {
            console.log('value', val);
          }
        },
        { immediate: true }
      );
      return () => (
        <span class="com-input">
          <seal-input
            {...attrs}
            v-model={[currentValue.value, ['trim']]}
            allow-clear
            min={0}
            formatter={(value) => {
              return fomatter(value);
            }}
            onInput={(value, ev) => {
              emit('input', setFormatterValue(value), ev);
            }}
            onChange={(value) => {
              emit('update:modelValue', setFormatterValue(value));
            }}
            v-slots={{
              append: () => <span>{WidgetAppendUnit[widget.value]}</span>
            }}
          ></seal-input>
        </span>
      );
    }
  });
</script>

<style lang="less" scoped>
  .com-input {
    :deep(.arco-input-wrapper) {
      width: 100%;
    }
  }
</style>
