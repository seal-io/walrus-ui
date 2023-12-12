<script lang="tsx">
  import {
    defineComponent,
    ref,
    computed,
    toRefs,
    watch,
    inject,
    onMounted,
    withModifiers
  } from 'vue';
  import { BU, WidgetAppendUnit, WidgetValueUnit } from '../../types';

  export default defineComponent({
    name: 'ComInput',
    widgetType: 'input',
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
        return `${val}${WidgetValueUnit[widget.value]}`;
      };
      watch(
        () => modelValue.value,
        (val) => {
          if (val) {
            currentValue.value = fomatter(val);
          }
        },
        { immediate: true }
      );
      return () => (
        <span class="com-input">
          <seal-input
            {...attrs}
            popupInfo={attrs.popupInfo}
            v-model={[currentValue.value, ['trim']]}
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
