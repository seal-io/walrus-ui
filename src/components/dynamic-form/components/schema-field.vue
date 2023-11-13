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
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldMaps } from '../fields/field-map';
  import { getSchemaFieldComponent } from '../utils';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      if (!_.keys(props.schema.properties)) {
        return null;
      }

      const handleChange = (data) => {
        emit('change', data);
      };
      const { component } = getSchemaFieldComponent(
        props.schema,
        props.formData
      );
      if (!component) return null;
      return () => {
        const Component = component;
        return <Component {...props} onChange={(data) => handleChange(data)} />;
      };
    }
  });
</script>
