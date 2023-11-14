<script lang="tsx">
  import {
    defineComponent,
    PropType,
    toRefs,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props) {
      const { schema, formData, fieldPath } = toRefs(props);
      const handleChange = (data) => {
        console.log('data=======', data);
      };
      return () => (
        <div>
          <div>fieldPath: {fieldPath.value}</div>
          <div>schema: {JSON.stringify(schema.value)}</div>
          <div>formData: {JSON.stringify(formData.value)}</div>
        </div>
      );
    }
  });
</script>
