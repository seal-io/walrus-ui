<script lang="tsx">
  import {
    defineComponent,
    reactive,
    ref,
    watch,
    computed,
    toRefs,
    inject
  } from 'vue';
  import { InputWidth } from '@/views/config';

  export default defineComponent({
    name: 'BuSelect',
    props: {
      modelValue: {
        type: [String, Number, Array],
        default() {
          return '';
        }
      }
    },
    emits: ['update:modelValue', 'change', 'inputValueChange'],
    setup(props, { attrs, emit }) {
      const environmentID = inject('environmentID');
      const { modelValue } = toRefs(props);
      const { widget } = attrs;
      const dataList = ref<{ label: string; value: string }[]>([]);
      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });
      return () => (
        <>
          <seal-select
            model-value={modelValue.value}
            {...attrs}
            placeholder={widget}
            virtual-list-props={virtualListProps}
            style={{ width: `${InputWidth.LARGE}px` }}
            options={dataList.value}
            allow-search={true}
            onInputValueChange={(value: any) => {
              emit('inputValueChange', value);
            }}
            onChange={(value: any) => {
              emit('change', value);
              emit('update:modelValue', value);
            }}
          ></seal-select>
        </>
      );
    }
  });
</script>
