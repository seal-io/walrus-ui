<script lang="tsx">
  import {
    defineComponent,
    toRefs,
    ref,
    watch,
    provide,
    PropType,
    toRaw,
    onMounted,
    nextTick
  } from 'vue';
  import _ from 'lodash';
  import ajvValidate from '@/utils/ajv-validate';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import formProps from './form-props';
  import SchemaField from './components/schema-field.vue';
  import { ProviderFormRefKey } from './config';

  export default defineComponent({
    props: {
      ...formProps,
      action: {
        type: String as PropType<'edit' | 'view' | 'create'>,
        default() {
          return 'create';
        }
      }
    },
    emits: ['change'],
    setup(props, { emit, expose }) {
      const formref = ref();
      const formData = ref({});
      const uiFormData = ref({});
      const { disabled, layout } = toRefs(props);

      const { scrollToView } = useScrollToView();

      provide(ProviderFormRefKey, formref);

      const handleChange = (data) => {
        emit('change', data);
      };

      const handleSubmitFailed = (data) => {
        // TODO
      };

      const validate = async () => {
        const res = await formref.value?.validate();
        if (res) {
          scrollToView();
        }
        return res;
      };

      expose({
        validate
      });
      watch(
        () => props.internalFormData,
        () => {
          uiFormData.value = props.internalFormData;
        },
        {
          immediate: true,
          deep: true
        }
      );
      watch(
        () => props.originFormData,
        () => {
          formData.value = props.originFormData;
        },
        {
          immediate: true,
          deep: true
        }
      );

      return () => (
        <a-form
          ref={formref}
          disabled={disabled.value}
          model={formData.value}
          auto-label-width
          layout={layout.value}
          onSubmitFailed={(error) => handleSubmitFailed(error)}
        >
          <a-grid cols={12} col-gap={18} row-gap={16}>
            <SchemaField
              action={props.action}
              schema={props.schema}
              formData={formData.value}
              uiFormData={uiFormData.value}
              defaultFormData={props.defaultFormData}
              onChange={handleChange}
            ></SchemaField>
          </a-grid>
        </a-form>
      );
    }
  });
</script>
