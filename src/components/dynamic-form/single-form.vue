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
  import formProps from './form-props';
  import SchemaField from './components/schema-field.vue';

  export default defineComponent({
    props: formProps,
    emits: ['change'],
    setup(props, { emit }) {
      const formref = ref();
      const formData = ref();
      const { disabled, layout } = toRefs(props);
      const handleChange = (data) => {
        console.log('data=======', data);
        formData.value = data;
        emit('change', toRaw(formData.value));
      };
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
          v-model={formData.value}
          auto-label-width
          layout={layout.value}
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
