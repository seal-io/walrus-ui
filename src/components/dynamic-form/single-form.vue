<script lang="tsx">
  import {
    defineComponent,
    toRefs,
    ref,
    reactive,
    computed,
    toRaw,
    watch
  } from 'vue';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import formProps from './form-props';
  import SchemaField from './components/schema-field.vue';

  export default defineComponent({
    props: formProps,
    emits: ['change'],
    setup(props, { emit, expose }) {
      const formref = ref();
      const formData = ref();
      const { disabled, layout } = toRefs(props);

      const { scrollToView } = useScrollToView();

      const handleChange = (data) => {
        formData.value = data;
        emit('change', toRaw(formData.value));
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
          <SchemaField
            schema={props.schema}
            formData={formData.value}
            onChange={handleChange}
          ></SchemaField>
        </a-form>
      );
    }
  });
</script>
