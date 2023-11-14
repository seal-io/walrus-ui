<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import formProps from './form-props';
  import SchemaField from './components/schema-field.vue';

  export default defineComponent({
    props: formProps,
    setup(props) {
      const formref = ref();
      const formData = ref();
      const { disabled, layout } = toRefs(props);
      const handleChange = (data) => {
        console.log('data=======', data);
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
            formData={formData}
            onChange={handleChange}
          ></SchemaField>
        </a-form>
      );
    }
  });
</script>
